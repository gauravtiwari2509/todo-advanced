"use client";

import { useState, useEffect } from "react";
import { Todo, Checkpoint } from "@prisma/client";
import TodoForm from "../../components/forms/TodoForm";
import TodoItem from "../../components/todo/Todo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TodoWithCheckpoints extends Todo {
  checkpoints: Checkpoint[];
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<TodoWithCheckpoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("/api/todos");
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        setError("Failed to load todos. Please try again.");
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTodos();
    }
  }, [session]);

  const handleAddTodo = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
    } catch (error) {
      setError("Failed to add todo. Please try again.");
      console.error("Error adding todo:", error);
    }
  };

  const handleUpdateTodo = async (id: string, data: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      setError("Failed to update todo. Please try again.");
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error deleting todo:", error);
    }
  };

  const handleAddCheckpoint = async (todoId: string, title: string) => {
    try {
      const response = await fetch(`/api/todos/${todoId}/checkpoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to add checkpoint");
      }

      const newCheckpoint = await response.json();
      setTodos(
        todos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              checkpoints: [...todo.checkpoints, newCheckpoint],
            };
          }
          return todo;
        })
      );
    } catch (error) {
      setError("Failed to add checkpoint. Please try again.");
      console.error("Error adding checkpoint:", error);
    }
  };

  const handleUpdateCheckpoint = async (
    todoId: string,
    checkpointId: string,
    completed: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/todos/${todoId}/checkpoints/${checkpointId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update checkpoint");
      }

      const updatedCheckpoint = await response.json();
      setTodos(
        todos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              checkpoints: todo.checkpoints.map((cp) =>
                cp.id === checkpointId ? { ...cp, ...updatedCheckpoint } : cp
              ),
            };
          }
          return todo;
        })
      );
    } catch (error) {
      setError("Failed to update checkpoint. Please try again.");
      console.error("Error updating checkpoint:", error);
    }
  };

  const handleDeleteCheckpoint = async (
    todoId: string,
    checkpointId: string
  ) => {
    try {
      const response = await fetch(
        `/api/todos/${todoId}/checkpoints/${checkpointId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete checkpoint");
      }

      setTodos(
        todos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              checkpoints: todo.checkpoints.filter(
                (cp) => cp.id !== checkpointId
              ),
            };
          }
          return todo;
        })
      );
    } catch (error) {
      setError("Failed to delete checkpoint. Please try again.");
      console.error("Error deleting checkpoint:", error);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <TodoForm onSubmit={handleAddTodo} />

      {loading ? (
        <div className="text-center py-10">Loading tasks...</div>
      ) : todos.length === 0 ? (
        <div className="text-center py-10 bg-gray-200 rounded-lg">
          <p className="text-gray-500">
            No tasks yet. Add your first task above!
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Active Tasks</h2>
            {todos.filter((todo) => !todo.completed).length === 0 ? (
              <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                No active tasks. Great job!
              </p>
            ) : (
              todos
                .filter((todo) => !todo.completed)
                .map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                    onAddCheckpoint={handleAddCheckpoint}
                    onUpdateCheckpoint={handleUpdateCheckpoint}
                    onDeleteCheckpoint={handleDeleteCheckpoint}
                 
                  />
                ))
            )}
          </div>

          {todos.filter((todo) => todo.completed).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Completed Tasks</h2>
              {todos
                .filter((todo) => todo.completed)
                .map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                    onAddCheckpoint={handleAddCheckpoint}
                    onUpdateCheckpoint={handleUpdateCheckpoint}
                    onDeleteCheckpoint={handleDeleteCheckpoint}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
