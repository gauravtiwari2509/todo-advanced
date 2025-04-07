import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../../auth/[...nextauth]/route";

// GET - Get a single checkpoint
export async function GET(
  request: Request,
  { params }: { params: { id: string; checkpointId: string } }
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

    const checkpoint = await prisma.checkpoint.findUnique({
      where: { id: params.checkpointId },
    });

    if (!checkpoint || checkpoint.todoId !== params.id) {
      return NextResponse.json(
        { error: "Checkpoint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(checkpoint);
  } catch (error) {
    console.error("Error fetching checkpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkpoint" },
      { status: 500 }
    );
  }
}

// PATCH - Update a checkpoint
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; checkpointId: string } }
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

    const { title, completed } = await request.json();
    const updateData: { title?: string; completed?: boolean } = {};

    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const checkpoint = await prisma.checkpoint.update({
      where: { id: params.checkpointId },
      data: updateData,
    });

    return NextResponse.json(checkpoint);
  } catch (error) {
    console.error("Error updating checkpoint:", error);
    return NextResponse.json(
      { error: "Failed to update checkpoint" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a checkpoint
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; checkpointId: string } }
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

    const checkpoint = await prisma.checkpoint.findUnique({
      where: { id: params.checkpointId },
    });

    if (!checkpoint || checkpoint.todoId !== params.id) {
      return NextResponse.json(
        { error: "Checkpoint not found" },
        { status: 404 }
      );
    }

    await prisma.checkpoint.delete({
      where: { id: params.checkpointId },
    });

    return NextResponse.json({ message: "Checkpoint deleted" });
  } catch (error) {
    console.error("Error deleting checkpoint:", error);
    return NextResponse.json(
      { error: "Failed to delete checkpoint" },
      { status: 500 }
    );
  }
}
