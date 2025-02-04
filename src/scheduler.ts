import { config } from 'dotenv';
config();

import { CronJob } from 'cron';
import { tweetNextComic } from './tweetNextComic';
import { initializeDb } from './db';

// Initialize the database
initializeDb().then(() => {
    console.log('Database initialized');
    
    // Tweet comic every day at 9:00 AM
    new CronJob('0 9 * * *', async () => {
        console.log('Tweeting next comic...');
        await tweetNextComic();
    }, null, true, 'America/Los_Angeles');

    // Follow users every day at 9:15 AM
    // new CronJob('15 9 * * *', async () => {
    //   console.log('Following users...');
    //   await followUsers();
    // }, null, true, 'America/Los_Angeles');

    console.log('Scheduler started.');
}).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
}); 