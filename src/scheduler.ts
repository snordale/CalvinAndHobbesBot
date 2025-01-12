import { CronJob } from 'cron';
import { tweetNextComic, followUsers } from './bot';

// Tweet comic every day at 16:00 (4 PM)
new CronJob('0 9 * * *', async () => {
  console.log('Tweeting next comic...');
  await tweetNextComic();
}, null, true, 'America/Los_Angeles');

// Follow users every day at 15:00 (3 PM)
new CronJob('0 9 * * *', async () => {
  console.log('Following users...');
  await followUsers();
}, null, true, 'America/Los_Angeles');

console.log('Scheduler started!'); 