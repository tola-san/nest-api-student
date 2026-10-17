# Student Management REST API

A beginner-friendly REST API for managing student records built with **NestJS**, **Prisma ORM**, **PostgreSQL**, and **Docker**.

---

## 📁 Project Structure

```text
student-api/
├── src/
│   ├── students/
│   │   ├── dto/
│   │   │   ├── create-student.dto.ts  # Input validation schema for creating a student
│   │   │   ├── update-student.dto.ts  # Input validation schema for updating a student
│   │   │   └── index.ts              # Barrel export for DTOs
│   │   ├── students.module.ts         # Encapsulates students controller and service
│   │   ├── students.controller.ts     # Handles incoming HTTP requests and routing
│   │   ├── students.service.ts        # Business logic and database operations with Prisma
│   │   └── students.controller.spec.ts# Unit tests for the StudentsController
│   ├── prisma/
│   │   ├── prisma.module.ts           # Global module exporting PrismaService
│   │   └── prisma.service.ts          # Extends PrismaClient and handles connection lifecycle
│   ├── app.module.ts                  # Root application module
│   └── main.ts                        # Application entry point with ValidationPipe
├── prisma/
│   └── schema.prisma                  # Prisma data model definition and DB configuration
├── test/
│   ├── jest-e2e.json                  # Jest configuration for end-to-end tests
│   └── students.e2e-spec.ts           # End-to-end HTTP integration tests with Supertest
├── Dockerfile                         # Multi-stage production container build
├── compose.yaml                       # Orchestrates API and PostgreSQL containers
├── .dockerignore                      # Prevents local files from being copied into Docker
├── .env.example                       # Template for environment variables
├── .gitignore                         # Files ignored by git version control
├── package.json                       # Project dependencies and npm scripts
├── tsconfig.json                      # TypeScript compiler configuration (CommonJS)
└── README.md                          # Project documentation and commands
```

---

## 🛠️ Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/students` | Create a new student | `{"name": "Alice", "email": "alice@example.com", "age": 20}` |
| `GET` | `/students` | List all students | None |
| `GET` | `/students/:id` | Get student by ID | None |
| `PATCH` | `/students/:id` | Update student details | `{"name": "Alice Updated", ...}` (optional fields) |
| `DELETE` | `/students/:id` | Delete student by ID | None |

---

## 🚀 Getting Started with Docker Compose

### 1. Copy Environment Variables
Create your local `.env` file from the example:
```bash
cp .env.example .env
```

### 2. Build and Start the Containers
Start PostgreSQL and the NestJS API in detached mode:
```bash
docker compose up -d --build
```

### 3. Run Prisma Database Migrations
Once the database container is healthy, run Prisma migrations inside the API container:
```bash
docker compose exec api npx prisma migrate dev --name init
```

### 4. View Application Logs
Stream logs from all services or a specific service:
```bash
# View all logs
docker compose logs -f

# View API logs only
docker compose logs -f api

# View PostgreSQL logs only
docker compose logs -f postgres
```

### 5. Check Container Status
```bash
docker compose ps
```

### 6. Stop the Containers
Stop containers while preserving database volume data:
```bash
docker compose down
```

To stop containers and delete the database volume:
```bash
docker compose down -v
```

---

## 🧪 Testing Commands

### Run Unit Tests
```bash
npm run test
```

### Run End-to-End (E2E) Tests
```bash
npm run test:e2e
```

### Test Inside Docker
```bash
docker compose exec api npm run test
```

---

## 💻 Local Development (Without Docker for API)

If running PostgreSQL via Docker but running NestJS on your host machine:

1. Start only the PostgreSQL database:
   ```bash
   docker compose up -d postgres
   ```

2. Generate the Prisma client:
   ```bash
   npm run prisma:generate
   ```

3. Run migrations locally:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start NestJS in watch mode:
   ```bash
   npm run start:dev
   ```
