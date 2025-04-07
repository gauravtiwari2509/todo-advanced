import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Response formatting rules
const responseRules = {
  rules: [
    {
      rule: "Avoid JSON format in response",
      description:
        "Never return the entire JSON structure. Provide human-readable summaries.",
    },
    {
      rule: "Formating rules",
      description:
        "Ensure the response is formatted using proper markdown syntax. Use headings for titles or sections, bold text for link titles or important terms, and italics for links or emphasis. If applicable, use bullet points for lists or key items. Ensure proper use of code formatting (inline `code` or code blocks) where needed and keep the structure clear and easy to read.",
    },
    {
      rule: "Focus on relevance",
      description:
        "Share only relevant details based on the user's query, especially from their todos.",
    },
    {
      rule: "Be concise",
      description:
        "Keep answers short and to the point. Avoid overwhelming the user with unnecessary data.",
    },
    {
      rule: "Clarify vague requests",
      description: "Ask for more details if the user's request is unclear.",
    },
    {
      rule: "use previous messages to process the current prompt",
      description:
        "just don't repeat the previous messages reply always reply to current prompt use previous messages to process the current prompt",
    },
    {
      rule: "return a polite thankyou and ask feel free to ask more question message",
      description:
        "when someone appreciate you then return proper message with polite thankyou and ask feel free to ask more question message",
    },
  ],
};

// POST - Send a message to the AI chatbot
// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const { message } = await request.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }

//     // Get user's todos for context
//     const todos = await prisma.todo.findMany({
//       where: { userId: user.id },
//       include: { checkpoints: true },
//       orderBy: { createdAt: "desc" },
//       take: 10, // Limit to 10 recent todos for context
//     });

//     // Format todos for context
//     const todosContext = todos.map((todo) => ({
//       id: todo.id,
//       title: todo.title,
//       description: todo.description || "",
//       completed: todo.completed,
//       priority: todo.priority || "MEDIUM",
//       category: todo.category || "Uncategorized",
//       checkpoints: todo.checkpoints.map((cp) => ({
//         id: cp.id,
//         title: cp.title,
//         completed: cp.completed,
//       })),
//     }));

//     // Get analytics data for context
//     const analytics = await prisma.analytics.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//       take: 1,
//     });

//     // Create a context object for the response
//     const context = {
//       user: {
//         name: user.name,
//         email: user.email,
//       },
//       todos: todosContext,
//       analytics: analytics.length > 0 ? analytics[0] : null,
//       rules: responseRules.rules,
//     };

//     // Generate a response based on the user's message and context
//     let reply = "";

//     // Check if the message is a greeting
//     if (message.toLowerCase().match(/^(hi|hello|hey|greetings)/i)) {
//       reply = `# Hello ${
//         user.name || "there"
//       }! 👋\n\nHow can I help you with your tasks today?`;
//     }
//     // Check if the message is asking about todos
//     else if (message.toLowerCase().match(/todo|task|list|what do i have/i)) {
//       if (todos.length === 0) {
//         reply =
//           "## You don't have any tasks yet\n\nWould you like me to help you create your first task?";
//       } else {
//         const completedCount = todos.filter((t) => t.completed).length;
//         const pendingCount = todos.length - completedCount;

//         reply = `## Your Tasks Overview\n\nYou have **${todos.length}** tasks in total:\n- **${completedCount}** completed\n- **${pendingCount}** pending\n\n### Recent Tasks:\n\n`;

//         todos.slice(0, 5).forEach((todo) => {
//           const status = todo.completed ? "✅" : "⏳";
//           reply += `- ${status} **${todo.title}**\n`;
//           if (todo.checkpoints.length > 0) {
//             const completedCheckpoints = todo.checkpoints.filter(
//               (cp) => cp.completed
//             ).length;
//             reply += `  - Checkpoints: ${completedCheckpoints}/${todo.checkpoints.length} completed\n`;
//           }
//         });

//         if (todos.length > 5) {
//           reply += `\n*You have ${
//             todos.length - 5
//           } more tasks. Would you like to see them all?*`;
//         }
//       }
//     }
//     // Check if the message is asking about analytics
//     else if (
//       message.toLowerCase().match(/analytics|stats|progress|productivity/i)
//     ) {
//       if (analytics.length === 0) {
//         reply =
//           "## No Analytics Available\n\nYou don't have any analytics data yet. Start completing tasks to see your productivity insights!";
//       } else {
//         const data = analytics[0];
//         reply = `## Your Productivity Insights\n\n- **Total Tasks**: ${
//           data.totalTasks
//         }\n- **Completed Tasks**: ${
//           data.completedTasks
//         }\n- **Completion Rate**: ${(
//           (data.completedTasks / data.totalTasks) *
//           100
//         ).toFixed(1)}%\n- **Time Spent**: ${data.timeSpent.toFixed(
//           1
//         )} minutes\n\n`;

//         if (data.completedTasks > 0) {
//           reply += "### Recent Achievements\n\n";
//           const recentCompleted = todos.filter((t) => t.completed).slice(0, 3);
//           recentCompleted.forEach((todo) => {
//             reply += `- ✅ **${todo.title}**\n`;
//           });
//         }
//       }
//     }
//     // Check if the message is a thank you
//     else if (message.toLowerCase().match(/thank|thanks|appreciate/i)) {
//       reply = `# Thank you for your kind words! 🙏\n\nI'm glad I could help. Feel free to ask me anything else about your tasks or productivity. I'm here to assist you!`;
//     }
//     // Default response
//     else {
//       reply = `## I understand you're asking about: "${message}"\n\n`;

//       if (todos.length > 0) {
//         reply += "### Your Recent Tasks\n\n";
//         todos.slice(0, 3).forEach((todo) => {
//           const status = todo.completed ? "✅" : "⏳";
//           reply += `- ${status} **${todo.title}**\n`;
//         });
//       }

//       reply += "\nHow can I help you with these tasks? I can:\n";
//       reply += "- Suggest priorities\n";
//       reply += "- Help organize your workflow\n";
//       reply += "- Provide productivity tips\n";
//       reply += "- Answer questions about task management\n\n";
//       reply += "Just let me know what you need!";
//     }

//     return NextResponse.json({ reply });
//   } catch (error) {
//     console.error("Error processing chatbot request:", error);
//     return NextResponse.json(
//       { error: "Failed to process request" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(request: Request) {
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

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get user's todos for context
    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      include: { checkpoints: true },
      orderBy: { createdAt: "desc" },
      take: 10, // Limit to 10 recent todos for context
    });

    // Format todos for context
    const todosContext = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description || "",
      completed: todo.completed,
      priority: todo.priority || "MEDIUM",
      category: todo.category || "Uncategorized",
      checkpoints: todo.checkpoints.map((cp) => ({
        id: cp.id,
        title: cp.title,
        completed: cp.completed,
      })),
    }));

    // Get analytics data for user's todos (using todoId relation)
    const analytics = await prisma.analytics.findMany({
      where: {
        todoId: { in: todos.map((todo) => todo.id) }, // Fetch analytics based on user's todos
      },
      orderBy: { createdAt: "desc" },
      take: 1, // Get the latest analytics entry
    });

    // Create a context object for the response
    const context = {
      user: {
        name: user.name,
        email: user.email,
      },
      todos: todosContext,
      analytics: analytics.length > 0 ? analytics[0] : null,
      rules: responseRules.rules,
    };

    // Generate a response based on the user's message and context
    let reply = "";

    // Check if the message is a greeting
    if (message.toLowerCase().match(/^(hi|hello|hey|greetings)/i)) {
      reply = `# Hello ${
        user.name || "there"
      }! 👋\n\nHow can I help you with your tasks today?`;
    }
    // Check if the message is asking about todos
    else if (message.toLowerCase().match(/todo|task|list|what do i have/i)) {
      if (todos.length === 0) {
        reply =
          "## You don't have any tasks yet\n\nWould you like me to help you create your first task?";
      } else {
        const completedCount = todos.filter((t) => t.completed).length;
        const pendingCount = todos.length - completedCount;

        reply = `## Your Tasks Overview\n\nYou have **${todos.length}** tasks in total:\n- **${completedCount}** completed\n- **${pendingCount}** pending\n\n### Recent Tasks:\n\n`;

        todos.slice(0, 5).forEach((todo) => {
          const status = todo.completed ? "✅" : "⏳";
          reply += `- ${status} **${todo.title}**\n`;
          if (todo.checkpoints.length > 0) {
            const completedCheckpoints = todo.checkpoints.filter(
              (cp) => cp.completed
            ).length;
            reply += `  - Checkpoints: ${completedCheckpoints}/${todo.checkpoints.length} completed\n`;
          }
        });

        if (todos.length > 5) {
          reply += `\n*You have ${
            todos.length - 5
          } more tasks. Would you like to see them all?*`;
        }
      }
    }
    // Check if the message is asking about analytics
    else if (
      message.toLowerCase().match(/analytics|stats|progress|productivity/i)
    ) {
      if (analytics.length === 0) {
        reply =
          "## No Analytics Available\n\nYou don't have any analytics data yet. Start completing tasks to see your productivity insights!";
      } else {
        const data = analytics[0];
        reply = `## Your Productivity Insights\n\n- **Total Tasks**: ${
          data.totalTasks
        }\n- **Completed Tasks**: ${
          data.completedTasks
        }\n- **Completion Rate**: ${
          (data.completedTasks / data.totalTasks) * 100
        }%\n- **Time Spent**: ${data.timeSpent.toFixed(1)} minutes\n\n`;

        if (data.completedTasks > 0) {
          reply += "### Recent Achievements\n\n";
          const recentCompleted = todos.filter((t) => t.completed).slice(0, 3);
          recentCompleted.forEach((todo) => {
            reply += `- ✅ **${todo.title}**\n`;
          });
        }
      }
    }
    // Check if the message is a thank you
    else if (message.toLowerCase().match(/thank|thanks|appreciate/i)) {
      reply = `# Thank you for your kind words! 🙏\n\nI'm glad I could help. Feel free to ask me anything else about your tasks or productivity. I'm here to assist you!`;
    }
    // Default response
    else {
      reply = `## I understand you're asking about: "${message}"\n\n`;

      if (todos.length > 0) {
        reply += "### Your Recent Tasks\n\n";
        todos.slice(0, 3).forEach((todo) => {
          const status = todo.completed ? "✅" : "⏳";
          reply += `- ${status} **${todo.title}**\n`;
        });
      }

      reply += "\nHow can I help you with these tasks? I can:\n";
      reply += "- Suggest priorities\n";
      reply += "- Help organize your workflow\n";
      reply += "- Provide productivity tips\n";
      reply += "- Answer questions about task management\n\n";
      reply += "Just let me know what you need!";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error processing chatbot request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// GET - Fetch chat history
export async function GET() {
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

    // Return empty array for now since we don't have a chat history table yet
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}
