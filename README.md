# Task Manager REST API with AI Integration

A Node.js + Express REST API for managing tasks, with an AI-powered task planning endpoint powered by the Groq API.

## Tech Stack

- Node.js + Express.js
- MongoDB (Mongoose)
- dotenv
- Groq SDK (`groq-sdk`)

## Project Structure

```
.
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── taskController.js  # CRUD logic for tasks
│   └── aiController.js    # Groq AI plan-task logic
├── models/
│   └── Task.js            # Mongoose task schema
├── routes/
│   ├── taskRoutes.js      # /api/tasks
│   └── aiRoutes.js        # /api/ai
├── server.js              # Express entry point
├── .env.example
└── package.json
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `MONGO_URI` — your MongoDB connection string
   - `GROQ_API_KEY` — get one from https://console.groq.com/keys
   - `GROQ_MODEL` — defaults to `openai/gpt-oss-120b`

3. Start the server:
   ```bash
   npm start
   # or for auto-reload on changes:
   npm run dev
   ```

The server runs on `http://localhost:5000` by default.

## API Endpoints

### Tasks

| Method | Route             | Description        |
|--------|-------------------|--------------------|
| POST   | `/api/tasks`      | Create a task      |
| GET    | `/api/tasks`      | Get all tasks (supports `?status=pending` filter) |
| GET    | `/api/tasks/:id`  | Get a single task  |
| PUT    | `/api/tasks/:id`  | Update a task      |
| DELETE | `/api/tasks/:id`  | Delete a task      |

**Create task body:**
```json
{
  "title": "Write report",
  "description": "Q3 summary report",
  "status": "pending",
  "dueDate": "2026-12-01"
}
```

### AI

| Method | Route                  | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | `/api/ai/plan-task`    | Generate an AI plan from a description |

**Request body:**
```json
{
  "description": "Launch a marketing campaign for our new product"
}
```

**Response:**
```json
{
  "success": true,
  "plan": {
    "summary": "...",
    "priority": "medium",
    "estimatedHours": 8,
    "steps": ["step1", "step2", "step3"]
  }
}
```
