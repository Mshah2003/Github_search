# GitHub Repository Finder

A modern full-stack web application that allows users to search for GitHub repositories, automatically stores results in a Supabase database, and displays them on a beautiful dashboard with search history.

## 🚀 Features

- **Repository Search**: Search GitHub repositories by keyword with real-time API integration
- **Database Storage**: Automatic storage of all search results in Supabase database
- **Interactive Dashboard**: Beautiful UI displaying search results and history
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling and user feedback
- **Search History**: View and track all previous searches
- **Modern UI**: Glass-morphism design with smooth animations

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **Supabase** for database (PostgreSQL)
- **GitHub REST API** for repository data
- **CORS** enabled for cross-origin requests

### Database
- **Supabase** (PostgreSQL)
- Row Level Security (RLS) enabled
- Automatic timestamps and UUIDs

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- A Supabase account and project
- Git (for cloning the repository)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd github-repository-finder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to find your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=5000
```

### 4. Set Up Database Schema

The application will automatically create the necessary database tables when you first run the migrations. The schema includes:

- `searches` table with columns:
  - `id` (UUID, primary key)
  - `keyword` (text, search term)
  - `repository_data` (JSONB, array of repositories)
  - `total_count` (integer, total repositories found)
  - `created_at` (timestamp)

### 5. Run the Application

For development (runs both client and server):
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📚 API Endpoints

### POST /api/search
Search GitHub repositories and store results.

**Request Body:**
```json
{
  "keyword": "react",
  "page": 1,
  "per_page": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "search_id": "uuid",
    "keyword": "react",
    "repositories": [...],
    "total_count": 1000,
    "current_page": 1,
    "per_page": 10,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/results
Retrieve all stored search results with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

### GET /api/results/:keyword
Search stored results by keyword.

### GET /api/health
Health check endpoint.

## 🎨 UI Components

### SearchForm
- Input validation and error handling
- Loading states with spinner
- Responsive design
- Real-time feedback

### Dashboard
- Statistics overview (total searches, repositories, unique keywords)
- Current search results display
- Search history with detailed information
- Empty states and loading indicators

### RepositoryCard
- Repository information display
- Owner details with avatar
- Statistics (stars, forks)
- Direct links to GitHub
- Language badges
- Last updated information

## 📊 Database Schema

```sql
-- Searches table
CREATE TABLE searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  repository_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX searches_keyword_idx ON searches(keyword);
CREATE INDEX searches_created_at_idx ON searches(created_at DESC);
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- CORS configured for secure cross-origin requests
- Input validation and sanitization
- Error handling without sensitive data exposure

## 🚀 Deployment

### Recommended Platforms

1. **Frontend**: Vercel, Netlify, or GitHub Pages
2. **Backend**: Railway, Render, or Heroku
3. **Database**: Supabase (already configured)

### Build Commands

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🧪 Testing

The application includes comprehensive error handling and validation:

- API response validation
- Database connection error handling
- User input validation
- Network error handling
- Empty state management

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `PORT` | Server port (default: 5000) | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly
4. Check the GitHub API rate limits

## 🎯 Future Enhancements

- User authentication and personal search history
- Advanced filtering and sorting options
- Export functionality for search results
- Real-time notifications
- Search result analytics
- Favorite repositories feature

---

Built with ❤️ using React, Express.js, and Supabase