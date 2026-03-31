# Spend It — Backend API

A personal finance tracker backend built with **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Runtime    | Node.js (ESM)                 |
| Framework  | Express 5                     |
| Language   | TypeScript 6                  |
| ORM        | Prisma 7                      |
| Database   | PostgreSQL                    |
| Auth       | JWT (access + refresh tokens) |
| Validation | Zod 4                         |
| AI         | Google GenAI                  |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd Backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/spendit
JWT_SECRET=your_jwt_secret
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:5000`.

---

## Project Structure

```
src/
├── app.ts                  # Express app setup & route mounting
├── server.ts               # Server entry point
├── config/
│   ├── db.ts               # Database config
│   └── env.ts              # Environment variables
├── db/
│   └── prisma.ts           # Prisma client instance
├── generated/              # Prisma generated client
├── middleware/
│   ├── authMiddleware.ts   # JWT authentication guard
│   ├── errorMiddleware.ts  # Global error handler
│   └── validate.ts         # Zod validation middleware
├── modules/
│   ├── ai/
│   │   └── service.ts      # AI categorization service
│   ├── auth/
│   │   ├── controller.ts
│   │   ├── routes.ts
│   │   ├── service.ts
│   │   └── validation.ts
│   ├── expense/
│   │   ├── controller.ts
│   │   ├── routes.ts
│   │   ├── service.ts
│   │   └── validation.ts
│   └── income/
│       ├── controller.ts
│       ├── routes.ts
│       ├── service.ts
│       └── validation.ts
└── utils/
    ├── asyncHandler.ts
    └── response.ts
prisma/
└── schema.prisma           # Database schema
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint                  | Auth | Description            |
| ------ | ------------------------- | ---- | ---------------------- |
| POST   | `/api/auth/register`      | No   | Register a new user    |
| POST   | `/api/auth/login`         | No   | Login & get tokens     |
| GET    | `/api/auth/me`            | Yes  | Get current user       |
| POST   | `/api/auth/refresh-token` | No   | Refresh access token   |
| POST   | `/api/auth/logout`        | No   | Logout & clear cookies |

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Expenses — `/api/expenses`

> All expense routes require `Authorization: Bearer <token>`

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/api/expenses`         | Create a new expense  |
| GET    | `/api/expenses`         | Get all user expenses |
| GET    | `/api/expenses/summary` | Get expense summary   |
| GET    | `/api/expenses/:id`     | Get expense by ID     |
| DELETE | `/api/expenses/:id`     | Delete an expense     |

#### Create Expense

```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Groceries",
  "amount": 2500,
  "date": "2026-03-30",
  "category": "Food",
  "description": "Weekly grocery shopping",
  "tags": ["food", "weekly"]
}
```

**Response** `201`

```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": "uuid",
    "title": "Groceries",
    "amount": "2500",
    "date": "2026-03-30T00:00:00.000Z",
    "category": "Food",
    "description": "Weekly grocery shopping",
    "tags": ["food", "weekly"],
    "userId": "uuid",
    "createdAt": "2026-03-30T10:00:00.000Z",
    "updatedAt": "2026-03-30T10:00:00.000Z"
  }
}
```

#### Get All Expenses

```http
GET /api/expenses
Authorization: Bearer <token>
```

Optional query: `?year=2026`

---

### Income — `/api/income`

> All income routes require `Authorization: Bearer <token>`

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| POST   | `/api/income` | Create a new income  |
| GET    | `/api/income` | Get all user incomes |

#### Create Income

```http
POST /api/income
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Salary",
  "amount": 50000,
  "date": "2026-03-30T10:30:00.000Z",
  "source": "Company",
  "description": "March salary"
}
```

| Field         | Type   | Required | Notes              |
| ------------- | ------ | -------- | ------------------ |
| `title`       | string | Yes      | Min 1 character    |
| `amount`      | number | Yes      | Must be positive   |
| `date`        | string | Yes      | ISO 8601 datetime  |
| `source`      | string | No       | Income source      |
| `description` | string | No       | Additional details |

**Response** `201`

```json
{
  "success": true,
  "message": "Income created successfully",
  "data": {
    "id": "uuid",
    "title": "Salary",
    "amount": "50000",
    "date": "2026-03-30T10:30:00.000Z",
    "source": "Company",
    "description": "March salary",
    "userId": "uuid",
    "createdAt": "2026-03-30T10:31:00.000Z",
    "updatedAt": "2026-03-30T10:31:00.000Z"
  }
}
```

#### Get All Incomes

```http
GET /api/income
Authorization: Bearer <token>
```

Optional query: `?year=2026`

**Response** `200`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Salary",
      "amount": "50000",
      "date": "2026-03-30T10:30:00.000Z",
      "source": "Company",
      "description": "March salary",
      "userId": "uuid",
      "createdAt": "2026-03-30T10:31:00.000Z",
      "updatedAt": "2026-03-30T10:31:00.000Z"
    }
  ]
}
```

---

## Database Models

### User

| Field    | Type   | Notes       |
| -------- | ------ | ----------- |
| id       | UUID   | Primary key |
| name     | String |             |
| email    | String | Unique      |
| password | String | Hashed      |

### Expense

| Field          | Type     | Notes                      |
| -------------- | -------- | -------------------------- |
| id             | UUID     | Primary key                |
| title          | String   |                            |
| description    | String?  |                            |
| amount         | Decimal  | (10,2)                     |
| date           | DateTime |                            |
| category       | String?  | AI-suggested or manual     |
| tags           | String[] |                            |
| aiNote         | String?  | AI-generated note          |
| aiProvider     | String?  |                            |
| aiConfidence   | Float?   |                            |
| isManualEdited | Boolean  | Default: false             |
| userId         | String   | FK → User (cascade delete) |

### Income

| Field       | Type     | Notes                      |
| ----------- | -------- | -------------------------- |
| id          | UUID     | Primary key                |
| title       | String   |                            |
| amount      | Decimal  | (10,2)                     |
| date        | DateTime |                            |
| source      | String?  |                            |
| description | String?  |                            |
| userId      | String   | FK → User (cascade delete) |

---

## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Start dev server via tsx |

---

## License

ISC
