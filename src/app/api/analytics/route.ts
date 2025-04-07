import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// GET - Get analytics data for the authenticated user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get completion rate for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get all todos
    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      include: { analytics: true },
    });

    // Get completed todos count
    const completedTodos = todos.filter((todo) => todo.completed);

    // Calculate completion rate
    const completionRate =
      todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0;

    // Get todos by priority
    const highPriorityTodos = todos.filter((todo) => todo.priority === "HIGH");
    const mediumPriorityTodos = todos.filter(
      (todo) => todo.priority === "MEDIUM"
    );
    const lowPriorityTodos = todos.filter((todo) => todo.priority === "LOW");

    // Get todos by category
    const todosByCategory: Record<string, number> = {};
    todos.forEach((todo) => {
      if (todo.category) {
        todosByCategory[todo.category] =
          (todosByCategory[todo.category] || 0) + 1;
      }
    });

    // Get todos created in the last 7 days
    const recentTodos = todos.filter(
      (todo) => new Date(todo.createdAt) >= sevenDaysAgo
    );

    // Get todos completed in the last 7 days
    const recentCompletedTodos = completedTodos.filter(
      (todo) =>
        todo.analytics &&
        todo.analytics.completedAt &&
        new Date(todo.analytics.completedAt) >= sevenDaysAgo
    );

    // Calculate average completion time for completed todos
    let totalCompletionTime = 0;
    let todosWithCompletionTime = 0;

    completedTodos.forEach((todo) => {
      if (
        todo.analytics &&
        todo.analytics.completedAt &&
        todo.analytics.startedAt
      ) {
        const completionTime =
          new Date(todo.analytics.completedAt).getTime() -
          new Date(todo.analytics.startedAt).getTime();
        totalCompletionTime += completionTime;
        todosWithCompletionTime++;
      }
    });

    const averageCompletionTime =
      todosWithCompletionTime > 0
        ? totalCompletionTime / todosWithCompletionTime
        : 0;

    // Convert to hours
    const averageCompletionTimeHours = averageCompletionTime / (1000 * 60 * 60);

    return NextResponse.json({
      totalTodos: todos.length,
      completedTodos: completedTodos.length,
      completionRate: completionRate.toFixed(2),
      todosByPriority: {
        high: highPriorityTodos.length,
        medium: mediumPriorityTodos.length,
        low: lowPriorityTodos.length,
      },
      todosByCategory,
      recentTodos: recentTodos.length,
      recentCompletedTodos: recentCompletedTodos.length,
      averageCompletionTimeHours: averageCompletionTimeHours.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
