# TaskHub - Full Stack Task Manager

A full-stack Task Manager application built with **Angular 17+** (frontend) and **Spring Boot 3** (backend), using **MongoDB** for storage and **JWT** for authentication.

## Project Structure

```
Task-Manager-Fullstack/
├── frontend/          # Angular 17+ app (with Dockerfile)
├── backend/           # Spring Boot 3 app (with Dockerfile)
├── docker-compose.yml # Runs full stack with Docker
└── README.md
```

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Angular 17+, Tailwind CSS           |
| Backend   | Spring Boot 3.3, Java 17, Maven     |
| Database  | MongoDB                             |
| Auth      | JWT (Spring Security 6 + jjwt 0.12) |

## API Endpoints

### Auth (public)
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — returns JWT token

### Projects (JWT required)
- `GET /api/projects` — list user's projects
- `POST /api/projects` — create project
- `GET /api/projects/:id` — get project
- `PUT /api/projects/:id` — update project
- `DELETE /api/projects/:id` — delete project + its tasks

### Tasks (JWT required)
- `GET /api/projects/:projectId/tasks` — list tasks
- `POST /api/projects/:projectId/tasks` — create task
- `GET /api/tasks/:taskId` — get task by ID
- `PUT /api/tasks/:taskId` — update task
- `DELETE /api/tasks/:taskId` — delete task

## Running Locally

### Prerequisites
- Java 17+, Maven
- Node.js 18+, npm
- MongoDB running on `localhost:27017`

### 1. Start MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# or with Docker
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 3. Start Frontend
```bash
cd frontend
npm install
ng serve
# Runs on http://localhost:4200
```

## Running with Docker

### Prerequisites
- Docker and Docker Compose installed

### Start all services
```bash
docker-compose up --build
```

This starts:
- **MongoDB** on port 27017
- **Spring Boot backend** on port 8080
- **Angular frontend** on port 4200 (served via Nginx)

### Stop all services
```bash
docker-compose down
```

---

## JWT Auth Flow
1. Register at `/register` with username, email, password
2. Login at `/login` — JWT token stored in `localStorage`
3. All API requests include `Authorization: Bearer <token>` header automatically

## Credentials

There is no pre-seeded account. Register a new account at `/register` to get started.

**Example test credentials** (register these yourself on first run):
- Email: `test@example.com`
- Password: `password123`

JWT tokens expire after **24 hours**. All protected routes (`/dashboard`, `/projects/:id`, `/settings`) require a valid token and will redirect to `/login` if unauthenticated.

## UI Pages
| Route | Description |
|-------|-------------|
| `/` | Landing/About page |
| `/register` | Create account |
| `/login` | Sign in |
| `/dashboard` | Your projects |
| `/projects/:id` | Project task board (Kanban) |
