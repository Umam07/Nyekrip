import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    moduleSlug: string;
  }>;
}

export default async function JavaModuleRedirectPage({ params }: Props) {
  const { moduleSlug } = await params;
  redirect(`/course/java/${moduleSlug}`);
}
