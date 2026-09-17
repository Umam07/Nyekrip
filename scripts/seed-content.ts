import { neon } from "@neondatabase/serverless";
import { JAVA_COURSE_DATA } from "../lib/data/javaCourseData";
import fs from "fs";
import path from "path";

let databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!databaseUrl) {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        if (line.startsWith("DATABASE_URL=")) {
          databaseUrl = line.replace("DATABASE_URL=", "").trim().replace(/^"/, "").replace(/"$/, "");
          break;
        }
      }
    }
  } catch {
    // ignore
  }
}

async function seedContent() {
  if (!databaseUrl) {
    console.warn("DATABASE_URL is not defined in environment. Skipping database sync.");
    return;
  }

  const sql = neon(databaseUrl);
  console.log("Starting Nyekrip content synchronization with Neon Postgres...");

  try {
    // 1. Seed Course
    const courses = await sql`
      INSERT INTO courses (slug, title, language, description, "order")
      VALUES ('java', ${JAVA_COURSE_DATA.title}, ${JAVA_COURSE_DATA.language}, ${JAVA_COURSE_DATA.description}, 1)
      ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        description = EXCLUDED.description
      RETURNING id, title;
    `;
    const course = courses[0];
    console.log(`Course synchronized: ${course.title} (${course.id})`);

    // 2. Seed Modules & Lessons
    for (const mod of JAVA_COURSE_DATA.modules) {
      const modules = await sql`
        INSERT INTO modules (course_id, slug, title, short_description, level_group, level_name, "order")
        VALUES (${course.id}, ${mod.slug}, ${mod.title}, ${mod.shortDescription}, ${mod.levelGroup}, ${mod.levelName}, ${mod.order})
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          short_description = EXCLUDED.short_description,
          "order" = EXCLUDED."order"
        RETURNING id, title;
      `;
      const moduleData = modules[0];
      console.log(`  Module [${mod.order}]: ${mod.title}`);

      for (const lesson of mod.lessons) {
        const lessons = await sql`
          INSERT INTO lessons (module_id, slug, title, description, content_markdown, "order")
          VALUES (${moduleData.id}, ${lesson.slug}, ${lesson.title}, ${lesson.description}, ${lesson.contentMarkdown}, ${lesson.order})
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            content_markdown = EXCLUDED.content_markdown
          RETURNING id, title;
        `;
        const lessonData = lessons[0];

        // Seed Drag & Drop exercises
        const dndList = lesson.dragDropExercises || (lesson.dragDropExercise ? [lesson.dragDropExercise] : []);
        for (const dnd of dndList) {
          const exercises = await sql`
            INSERT INTO exercises (lesson_id, type, title, instruction, difficulty, xp_reward, "order", solution_explanation)
            VALUES (${lessonData.id}, 'drag_drop', ${dnd.title}, ${dnd.instruction}, ${dnd.difficulty}, ${dnd.xpReward}, 1, ${dnd.solutionExplanation || null})
            RETURNING id;
          `;
          const exData = exercises[0];

          if (exData && dnd.items) {
            for (const item of dnd.items) {
              await sql`
                INSERT INTO drag_drop_items (exercise_id, code_fragment, correct_position, explanation)
                VALUES (${exData.id}, ${item.codeFragment}, ${item.correctPosition}, ${item.explanation || null});
              `;
            }
          }

          // Seed into soal_puzzle
          await sql`
            INSERT INTO soal_puzzle (
              id, modul_id, urutan, judul, instruksi, tingkat_kesulitan, tipe, xp_reward,
              code_snippet, slots, tokens, question, options, solution_explanation
            )
            VALUES (
              ${dnd.id},
              ${mod.slug},
              ${(dnd as any).order || 1},
              ${dnd.title},
              ${dnd.instruction || null},
              ${dnd.difficulty},
              ${dnd.type || 'code_puzzle'},
              ${dnd.xpReward},
              ${dnd.codeSnippet || null},
              ${JSON.stringify(dnd.slots || {})},
              ${JSON.stringify(dnd.tokens || [])},
              ${dnd.question || null},
              ${JSON.stringify(dnd.options || [])},
              ${dnd.solutionExplanation || null}
            )
            ON CONFLICT (id) DO UPDATE SET
              judul = EXCLUDED.judul,
              instruksi = EXCLUDED.instruksi,
              tingkat_kesulitan = EXCLUDED.tingkat_kesulitan,
              xp_reward = EXCLUDED.xp_reward,
              code_snippet = EXCLUDED.code_snippet,
              slots = EXCLUDED.slots,
              tokens = EXCLUDED.tokens,
              solution_explanation = EXCLUDED.solution_explanation,
              updated_at = NOW();
          `;
        }

        // Seed Coding Problem
        if (lesson.codingProblem) {
          const cp = lesson.codingProblem;
          const codingExercises = await sql`
            INSERT INTO exercises (lesson_id, type, title, instruction, difficulty, xp_reward, "order")
            VALUES (${lessonData.id}, 'coding', ${cp.title}, ${cp.problemStatement}, ${cp.difficulty}, ${cp.xpReward}, 2)
            RETURNING id;
          `;
          const codingExData = codingExercises[0];

          if (codingExData) {
            const problems = await sql`
              INSERT INTO coding_problems (exercise_id, title, problem_statement, method_signature, starter_code, solution_code, time_limit_ms, memory_limit_kb)
              VALUES (${codingExData.id}, ${cp.title}, ${cp.problemStatement}, ${cp.methodSignature}, ${cp.starterCode}, ${cp.solutionCode || null}, ${cp.timeLimitMs}, ${cp.memoryLimitKb})
              RETURNING id;
            `;
            const probData = problems[0];

            if (probData && cp.testCases) {
              for (const tc of cp.testCases) {
                await sql`
                  INSERT INTO test_cases (coding_problem_id, input, expected_output, is_hidden)
                  VALUES (${probData.id}, ${tc.input}, ${tc.expectedOutput}, ${tc.isHidden || false});
                `;
              }
            }
          }

          // Seed into soal_autojudge
          await sql`
            INSERT INTO soal_autojudge (
              id, modul_id, urutan, judul, deskripsi, tingkat_kesulitan, xp_reward,
              starter_code, solution_code, method_signature, test_cases
            )
            VALUES (
              ${cp.id},
              ${mod.slug},
              1,
              ${cp.title},
              ${cp.problemStatement},
              ${cp.difficulty},
              ${cp.xpReward},
              ${cp.starterCode},
              ${cp.solutionCode || null},
              ${cp.methodSignature},
              ${JSON.stringify(cp.testCases || [])}
            )
            ON CONFLICT (id) DO UPDATE SET
              judul = EXCLUDED.judul,
              deskripsi = EXCLUDED.deskripsi,
              tingkat_kesulitan = EXCLUDED.tingkat_kesulitan,
              xp_reward = EXCLUDED.xp_reward,
              starter_code = EXCLUDED.starter_code,
              solution_code = EXCLUDED.solution_code,
              method_signature = EXCLUDED.method_signature,
              test_cases = EXCLUDED.test_cases;
          `;
        }
      }
    }

    console.log("Content seeding to Neon completed successfully!");
  } catch (err) {
    console.error("Error during content seeding:", err);
  }
}

seedContent().catch(console.error);
