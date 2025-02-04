import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for some cloud database providers like Heroku
    }
});

// Initialize the table if it doesn't exist
export async function initializeDb() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS recent_tweet (
                id SERIAL PRIMARY KEY,
                date TEXT NOT NULL
            );
            
            -- Insert initial date if table is empty
            INSERT INTO recent_tweet (date)
            SELECT '7/20/1987'
            WHERE NOT EXISTS (SELECT 1 FROM recent_tweet);
        `);
    } finally {
        client.release();
    }
}

// Get the most recent comic date
export async function getLastComicDate(): Promise<string> {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT date FROM recent_tweet LIMIT 1');
        return result.rows[0]?.date;
    } finally {
        client.release();
    }
}

// Update the most recent comic date
export async function updateLastComicDate(date: string): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('UPDATE recent_tweet SET date = $1', [date]);
    } finally {
        client.release();
    }
} 