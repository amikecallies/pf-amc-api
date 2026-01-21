# Portfolio API (pf-amc-api)

Backend API for Adrian Callies Portfolio Website. Built with Express.js and TypeScript, deployed on Railway.

## Features

- 📧 Contact form endpoint with AWS SES integration
- 🗄️ MongoDB Atlas database integration for portfolio data
- 🛡️ Rate limiting to prevent spam
- ✅ Input validation and sanitization
- 🔒 Security headers with Helmet
- 🌐 CORS configured for frontend domains
- 📘 Full TypeScript support with strict type checking
- 🔌 Centralized database connection with connection pooling

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account with a database cluster
- AWS account with SES configured
- Verified sender email in AWS SES

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pf-amc-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your actual values
```

### Environment Variables

| Variable                | Description                          | Required |
| ----------------------- | ------------------------------------ | -------- |
| `PORT`                  | Server port (default: 3001)          | No       |
| `NODE_ENV`              | Environment (development/production) | No       |
| `CORS_ORIGINS`          | Comma-separated allowed origins      | No       |
| `MONGO_URL`             | MongoDB Atlas connection string      | Yes      |
| `API_SECRET_KEY`        | API key for protected endpoints      | Yes      |
| `AWS_REGION`            | AWS region for SES                   | Yes      |
| `AWS_ACCESS_KEY_ID`     | AWS access key                       | Yes      |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                       | Yes      |
| `EMAIL_FROM`            | Verified sender email                | Yes      |
| `EMAIL_TO`              | Recipient email address              | Yes      |

### Running Locally

```bash
# Development mode (with auto-reload and TypeScript)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Production mode (runs compiled JavaScript)
npm start

# Type check without emitting files
npm run typecheck
```

### API Endpoints

All protected endpoints require the `x-Api-Key` header with a valid API key.

#### Health Check

```
GET /api/health
```

Returns server status.

#### Submit Contact Form

```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Your message has been sent successfully."
}
```

**Validation Error (400):**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [{ "field": "email", "message": "Invalid email format" }]
}
```

**Rate Limited (429):**

```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

#### Get Information (Protected)

```
GET /api/information
x-Api-Key: your_api_key_here
```

Retrieves portfolio information from MongoDB.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Information retrieved successfully.",
  "data": [...]
}
```

**Unauthorized (403):**

```json
{
  "success": false,
  "error": "Forbidden: Client is not authorized."
}
```

## Deployment (Railway)

1. Push this repo to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Add environment variables in Railway dashboard:
   - `MONGO_URL` - Your MongoDB Atlas connection string
   - `API_SECRET_KEY` - Your API key for protected endpoints
   - `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
   - `EMAIL_FROM`, `EMAIL_TO`
   - `CORS_ORIGINS` (optional)
5. Deploy!

Railway will automatically detect the Node.js project and run `npm run build` followed by `npm start`.

### MongoDB Atlas Setup

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist Railway's IP addresses (or use `0.0.0.0/0` for all IPs)
4. Get your connection string from the "Connect" button
5. Replace `<username>`, `<password>`, and `<database>` in the connection string
6. Add the connection string as `MONGO_URL` environment variable

## AWS SES Setup

To avoid emails going to spam:

1. **Verify your domain** in AWS SES (not just email address)
2. **Set up SPF, DKIM, and DMARC** records for your domain
3. **Move out of SES sandbox** by requesting production access
4. Use a **custom "From" address** on your verified domain

## Project Structure

```
pf-amc-api/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── config/
│   │   ├── index.ts          # Configuration management
│   │   └── database.ts       # MongoDB connection configuration
│   ├── types/
│   │   └── index.ts          # Shared TypeScript type definitions
│   ├── routes/
│   │   ├── index.ts          # Route aggregator
│   │   ├── contact.ts        # Contact endpoint
│   │   └── information.ts    # Information endpoint
│   ├── controllers/
│   │   ├── contactController.ts
│   │   └── informationController.ts
│   ├── services/
│   │   ├── emailService.ts   # AWS SES integration
│   │   └── database.ts       # MongoDB connection service
│   ├── middleware/
│   │   ├── rateLimiter.ts
│   │   ├── validator.ts
│   │   └── errorHandler.ts
│   └── utils/
├── dist/                     # Compiled JavaScript (generated)
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## TypeScript

This project uses TypeScript with strict type checking. Key type definitions can be found in `src/types/index.ts`:

- `ContactFormData` - Contact form submission payload
- `ApiSuccessResponse` / `ApiErrorResponse` - Standard API response types
- `AppConfig` - Application configuration structure

## Database Usage

The API uses a centralized database service for MongoDB operations. Example usage in controllers:

```typescript
import { databaseService } from "../services/database.js";

// Get a collection
const collection = databaseService.getCollection("collectionName");

// Query documents
const data = await collection.find({}).toArray();
const one = await collection.findOne({ _id: someId });

// Insert documents
await collection.insertOne({ name: "Example" });

// Update documents
await collection.updateOne({ _id: id }, { $set: { field: "value" } });

// Delete documents
await collection.deleteOne({ _id: id });
```

The database connection is established automatically when the server starts and includes:

- Connection pooling for optimal performance
- Automatic reconnection on connection loss
- Graceful shutdown handling

### Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start development server with hot reload (tsx) |
| `npm run build`     | Compile TypeScript to JavaScript               |
| `npm start`         | Run compiled production build                  |
| `npm run typecheck` | Run TypeScript type checking                   |

## License

MIT
