"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaUndo, FaPlus } from "react-icons/fa";
import { Todo, Checkpoint } from "@prisma/client";

interface TodoWithCheckpoints extends Todo {
  checkpoints?: Checkpoint[];
}

interface TodoProps {
  todo: TodoWithCheckpoints;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Todo>) => void;
  onAddCheckpoint: (todoId: string, checkpointTitle: string) => void;
  onUpdateCheckpoint: (
    todoId: string,
    checkpointId: string,
    completed: boolean
  ) => void;
  onDeleteCheckpoint: (todoId: string, checkpointId: string) => void;
}

export default function TodoItem({
  todo,
  onDelete,
  onUpdate,
  onAddCheckpoint,
  onUpdateCheckpoint,
  onDeleteCheckpoint,
}: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(
    todo.description || ""
  );
  const [isAddingCheckpoint, setIsAddingCheckpoint] = useState(false);
  const [newCheckpointTitle, setNewCheckpointTitle] = useState("");

  const handleUpdate = () => {
    if (editedTitle.trim()) {
      onUpdate(todo.id, {
        title: editedTitle,
        description: editedDescription || null,
      });
      setIsEditing(false);
    }
  };

  const handleAddCheckpoint = () => {
    if (newCheckpointTitle.trim()) {
      onAddCheckpoint(todo.id, newCheckpointTitle);
      setNewCheckpointTitle("");
      setIsAddingCheckpoint(false);
    }
  };

  return (
    <div className="bg-gray-100 text-black rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200">
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description (optional)"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdate(todo.id, { completed: !todo.completed })
                  }
                  className={`p-2 rounded-full ${
                    todo.completed
                      ? "bg-green-100 text-green-500"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {todo.completed ? <FaCheck /> : <FaUndo />}
                </button>
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-gray-600 mt-1">{todo.description}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Checkpoints Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Checkpoints
                </h4>
                <button
                  onClick={() => setIsAddingCheckpoint(true)}
                  className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>

              {isAddingCheckpoint && (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newCheckpointTitle}
                    onChange={(e) => setNewCheckpointTitle(e.target.value)}
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Checkpoint title"
                  />
                  <button
                    onClick={handleAddCheckpoint}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingCheckpoint(false)}
                    className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <ul className="space-y-2">
                {todo.checkpoints && todo.checkpoints.length > 0 ? (
                  todo.checkpoints.map((checkpoint) => (
                    <li
                      key={checkpoint.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checkpoint.completed}
                          onChange={() =>
                            onUpdateCheckpoint(
                              todo.id,
                              checkpoint.id,
                              !checkpoint.completed
                            )
                          }
                          className="h-4 w-4 text-blue-500 focus:ring-blue-400"
                        />
                        <span
                          className={`text-sm ${
                            checkpoint.completed
                              ? "line-through text-gray-500"
                              : "text-gray-700"
                          }`}
                        >
                          {checkpoint.title}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          onDeleteCheckpoint(todo.id, checkpoint.id)
                        }
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No checkpoints yet</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
