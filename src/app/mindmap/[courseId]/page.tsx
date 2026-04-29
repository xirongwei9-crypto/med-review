import { getCourse, getCardsByCourse } from "@/lib/cards";
import { notFound } from "next/navigation";
import type { MindMapGraph } from "@/types";
import { MindMapCanvas } from "@/components/mindmap/MindMapCanvas";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function MindMapPage({ params }: Props) {
  const { courseId } = await params;
  const course = getCourse(courseId);

  if (!course) notFound();

  const cards = getCardsByCourse(courseId);

  const graph: MindMapGraph = {
    courseId,
    nodes: cards.map((card) => ({
      id: card.id,
      label: card.title,
      group: card.category.split("/")[0],
      value: card.importance,
    })),
    edges: cards.flatMap((card) =>
      card.relatedCards
        .filter((relatedId) => cards.some((c) => c.id === relatedId))
        .map((relatedId) => ({
          from: card.id,
          to: relatedId,
        }))
    ),
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/mindmap"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{course.name} · 思维导图</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {graph.nodes.length} 个知识点节点，{graph.edges.length} 条关联边
            · 节点越大代表越重要 · 点击节点查看详情
          </p>
        </div>
      </div>

      {graph.nodes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          该课程暂无知识点卡片，请先添加卡片内容。
        </div>
      ) : (
        <MindMapCanvas graph={graph} />
      )}
    </div>
  );
}
