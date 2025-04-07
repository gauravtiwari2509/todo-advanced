"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaPlus } from "react-icons/fa";

const todoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  description: z.string().max(500).optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onFormSubmit = (data: TodoFormData) => {
    onSubmit(data);
    reset();
    setIsExpanded(false);
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-4">
          <div className="flex items-center">
            <input
              {...register("title")}
              type="text"
              placeholder="Add a new task..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onFocus={() => setIsExpanded(true)}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <FaPlus />
            </button>
          </div>
          {errors.title && (
            <p className="mt-1 text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {isExpanded && (
          <div className="mb-4">
            <textarea
              {...register("description")}
              placeholder="Description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                reset();
                setIsExpanded(false);
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
