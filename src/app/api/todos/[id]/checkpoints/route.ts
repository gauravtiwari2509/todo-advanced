import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";

// POST - Create a new checkpoint for a todo
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Verify the todo exists and belongs to the user
    const todo = await prisma.todo.findUnique({
      where: { id: params.id },
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    if (todo.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const checkpoint = await prisma.checkpoint.create({
      data: {
        title,
        todoId: params.id,
      },
    });

    return NextResponse.json(checkpoint, { status: 201 });
  } catch (error) {
    console.error("Error creating checkpoint:", error);
    return NextResponse.json(
      { error: "Failed to create checkpoint" },
      { status: 500 }
    );
  }
}
