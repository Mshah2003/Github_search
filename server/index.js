import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.json({
    message: 'GitHub Repository Finder API',
    status: 'running',
    endpoints: {
      search: 'POST /api/search',
      results: 'GET /api/results',
      health: 'GET /api/health'
    }
  });
});

app.post('/api/search', async (req, res) => {
  try {
    const { keyword, page = 1, per_page = 6 } = req.body;

    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Keyword is required and cannot be empty' 
      });
    }

    const githubUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(keyword.trim())}&sort=stars&order=desc&page=${page}&per_page=${per_page}`;
    
    const response = await fetch(githubUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Repo-Finder'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const repositories = data.items.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url
      }
    }));

    // Store in database
    const { data: insertedData, error: insertError } = await supabase
      .from('searches')
      .insert([{
        keyword: keyword.trim(),
        repository_data: repositories,
        total_count: data.total_count
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      return res.status(500).json({ 
        error: 'Failed to store search results in database' 
      });
    }

    res.json({
      success: true,
      data: {
        search_id: insertedData.id,
        keyword: insertedData.keyword,
        repositories,
        total_count: data.total_count,
        current_page: page,
        per_page,
        created_at: insertedData.created_at
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while searching repositories' 
    });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('searches')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Database fetch error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch search results from database' 
      });
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_count: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Results API error:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching results' 
    });
  }
});

app.get('/api/results/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('searches')
      .select('*', { count: 'exact' })
      .ilike('keyword', `%${keyword}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Database fetch error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch search results' 
      });
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_count: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Keyword search error:', error);
    res.status(500).json({ 
      error: 'An error occurred while searching for keyword results' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GitHub Repository Finder API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 API endpoints:`);
  console.log(`   POST /api/search - Search GitHub repositories`);
  console.log(`   GET  /api/results - Get all stored searches`);
  console.log(`   GET  /api/results/:keyword - Search by keyword`);
  console.log(`   GET  /api/health - Health check`);
});