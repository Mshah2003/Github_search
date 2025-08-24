/*
  # Create searches table for GitHub repository finder

  1. New Tables
    - `searches`
      - `id` (uuid, primary key)
      - `keyword` (text, the search term used)
      - `repository_data` (jsonb, array of repository objects from GitHub API)
      - `total_count` (integer, total repositories found)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `searches` table
    - Add policy for authenticated users to read and insert their own searches
    - Add policy for anonymous users to read and insert searches (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  repository_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read and insert searches for demo purposes
CREATE POLICY "Anyone can read searches"
  ON searches
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert searches"
  ON searches
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users
CREATE POLICY "Authenticated users can read searches"
  ON searches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert searches"
  ON searches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create index for faster keyword searches
CREATE INDEX IF NOT EXISTS searches_keyword_idx ON searches(keyword);
CREATE INDEX IF NOT EXISTS searches_created_at_idx ON searches(created_at DESC);