import { CronJob } from 'cron';
import { tweetNextComic, followUsers } from './bot';

// Tweet comic every day at 16:00 (4 PM)
new CronJob('0 16 * * *', async () => {
  console.log('Tweeting next comic...');
  await tweetNextComic();
}, null, true);

// Follow users every day at 15:00 (3 PM)
new CronJob('0 15 * * *', async () => {
  console.log('Following users...');
  await followUsers();
}, null, true);

console.log('Scheduler started!'); 