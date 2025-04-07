# Todo Fullstack App

A comprehensive task management application built with Next.js, featuring user authentication, task management with checkpoints, analytics dashboard, and AI assistance.

## Features

- **Authentication & Authorization**: Secure user authentication with NextAuth including multiple providers (Google, GitHub, Credentials)
- **Task Management**: Create, read, update, and delete todo items
- **Checkpoints**: Add milestones to each task to track granular progress
- **Analytics Dashboard**: Visualize task completion statistics and trends
- **AI Chatbot Assistant**: Get help with task management using Gemini AI

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (for development)
- **Authentication**: NextAuth.js
- **AI Integration**: Google Generative AI (Gemini)
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: React Hooks, Context API
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd todo-fullstack
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` (if available)
   - Configure the required environment variables:
     ```
     DATABASE_URL="file:./dev.db"
     NEXTAUTH_SECRET="your-nextauth-secret-key"
     GEMINI_API_KEY="your-gemini-api-key"
     GOOGLE_CLIENT_ID="your-google-client-id"
     GOOGLE_CLIENT_SECRET="your-google-client-secret"
     GITHUB_ID="your-github-id"
     GITHUB_SECRET="your-github-secret"
     ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   # or
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/            # Dashboard routes
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   └── chatbot/
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── todos/
│   │   ├── analytics/
│   │   └── chatbot/
│   └── components/             # React components
│       ├── forms/
│       ├── layout/
│       ├── todo/
│       ├── analytics/
│       ├── chatbot/
│       └── ui/
├── types/                      # TypeScript type definitions
└── lib/                        # Utility functions
```

## API Routes

- **GET /api/todos**: Get all todos
- **POST /api/todos**: Create a new todo
- **GET /api/todos/:id**: Get a specific todo
- **PATCH /api/todos/:id**: Update a todo
- **DELETE /api/todos/:id**: Delete a todo
- **POST /api/todos/:id/checkpoints**: Add a checkpoint to a todo
- **PATCH /api/todos/:id/checkpoints/:checkpointId**: Update a checkpoint
- **DELETE /api/todos/:id/checkpoints/:checkpointId**: Delete a checkpoint
- **GET /api/analytics**: Get analytics data
- **GET /api/chatbot**: Get chat history
- **POST /api/chatbot**: Send a message to the AI assistant

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Generative AI](https://ai.google.dev/)
- [Chart.js](https://www.chartjs.org/)
