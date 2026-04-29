import { getCoursesWithCardCount } from "@/lib/cards";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitGraph, ArrowRight } from "lucide-react";

export default function MindMapHubPage() {
  const coursesWithCount = getCoursesWithCardCount();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GitGraph className="h-6 w-6" />
          思维导图
        </h1>
        <p className="text-muted-foreground mt-1">
          选择课程查看知识点关联图谱
        </p>
      </div>

      <div className="space-y-3">
        {coursesWithCount.map((course) => (
          <Link key={course.id} href={`/mindmap/${course.id}`}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{course.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {course.description}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {course.cardCount} 个知识点
                </Badge>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
