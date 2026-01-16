# Portfolio API (pf-amc-api)

Backend API for Adrian Callies Portfolio Website. Built with Express.js and deployed on Railway.

## Features

- 📧 Contact form endpoint with AWS SES integration
- 🛡️ Rate limiting to prevent spam
- ✅ Input validation and sanitization
- 🔒 Security headers with Helmet
- 🌐 CORS configured for frontend domains

## Getting Started

### Prerequisites

- Node.js 18+ 
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

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `CORS_ORIGINS` | Comma-separated allowed origins | No |
| `AWS_REGION` | AWS region for SES | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `EMAIL_FROM` | Verified sender email | Yes |
| `EMAIL_TO` | Recipient email address | Yes |

### Running Locally

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### API Endpoints

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
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

## Deployment (Railway)

1. Push this repo to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Add environment variables in Railway dashboard
5. Deploy!

Railway will automatically detect the Node.js project and run `npm start`.

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
│   ├── index.js              # Express app entry point
│   ├── config/
│   │   └── index.js          # Configuration management
│   ├── routes/
│   │   ├── index.js          # Route aggregator
│   │   └── contact.js        # Contact endpoint
│   ├── controllers/
│   │   └── contactController.js
│   ├── services/
│   │   └── emailService.js   # AWS SES integration
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   ├── validator.js
│   │   └── errorHandler.js
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## License

MIT
