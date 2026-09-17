import { NextRequest, NextResponse } from "next/server";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderedIds, userSlots, selectedOptionId } = body;

    // Find exercise across lessons and modules
    let targetExercise = null;
    for (const mod of JAVA_COURSE_DATA.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.dragDropExercise && lesson.dragDropExercise.id === id) {
          targetExercise = lesson.dragDropExercise;
          break;
        }
        if (lesson.dragDropExercises) {
          const found = lesson.dragDropExercises.find((e) => e.id === id);
          if (found) {
            targetExercise = found;
            break;
          }
        }
      }
      if (targetExercise) break;
    }

    if (!targetExercise) {
      return NextResponse.json(
        { error: `Exercise with id "${id}" was not found.` },
        { status: 404 }
      );
    }

    let isAllCorrect = false;
    let feedback: unknown = null;

    // 1. Code Puzzle verification
    if (targetExercise.type === "code_puzzle" && targetExercise.slots) {
      const slots = targetExercise.slots;
      const keys = Object.keys(slots);
      isAllCorrect =
        keys.length > 0 &&
        keys.every(
          (k) =>
            userSlots &&
            typeof userSlots === "object" &&
            userSlots[k]?.trim() === slots[k]?.trim()
        );
      feedback = { userSlots, correctSlots: slots };
    }
    // 2. Multiple Choice verification
    else if (targetExercise.type === "multiple_choice" && targetExercise.options) {
      const chosen = targetExercise.options.find((o) => o.id === selectedOptionId);
      isAllCorrect = Boolean(chosen && chosen.isCorrect);
      feedback = { selectedOptionId, isCorrect: isAllCorrect };
    }
    // 3. Line Reorder verification
    else if (targetExercise.items && targetExercise.items.length > 0) {
      if (!Array.isArray(orderedIds)) {
        return NextResponse.json(
          { error: "Invalid request: orderedIds must be an array of item IDs." },
          { status: 400 }
        );
      }

      const itemById: Record<string, (typeof targetExercise.items)[0]> = {};
      for (const it of targetExercise.items) {
        itemById[it.id] = it;
      }
      const itemFeedback = orderedIds.map((itemId: string, index: number) => {
        const item = itemById[itemId];
        const isCorrect = item ? item.correctPosition === index + 1 : false;
        return {
          id: itemId,
          userPosition: index + 1,
          correctPosition: item ? item.correctPosition : null,
          isCorrect,
          explanation: item?.explanation || null,
        };
      });

      isAllCorrect = itemFeedback.every((f) => f.isCorrect);
      feedback = itemFeedback;
    }

    return NextResponse.json({
      success: true,
      isAllCorrect,
      xpEarned: isAllCorrect ? targetExercise.xpReward : 0,
      feedback,
      solutionExplanation: targetExercise.solutionExplanation || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/exercises/drag-drop/[id]/check:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while verifying answer." },
      { status: 500 }
    );
  }
}
