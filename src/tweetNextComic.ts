import { addDays } from 'date-fns';
import dotenv from 'dotenv';
import path from 'path';
import { TwitterApi } from 'twitter-api-v2';
import { USER_ID } from './constants';

dotenv.config();

/**
 * 1) Create a TwitterApi client instance with user authentication.
 *    Make sure your environment variables are set:
 *    X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 */

const creds = {
    appKey: process.env.X_API_KEY || '',
    appSecret: process.env.X_API_SECRET || '',
    accessToken: process.env.X_ACCESS_TOKEN || '',
    accessSecret: process.env.X_ACCESS_SECRET || '',
}

const client = new TwitterApi(creds);

/**
 * 2) The main function that calculates the date, reads the comic file,
 *    uploads the media, and tweets with that media attached.
 */
export async function tweetNextComic(): Promise<void> {
    try {
        console.log('Starting tweetNextComic...');

        // Get the last tweet date from the user's timeline
        const tweets = await client.v2.userTimeline(USER_ID, {
            max_results: 5,
            "tweet.fields": ["created_at"],
        });
        console.log('tweet: ', tweets.data.data[0]);
        const lastTweetText = tweets.data.data[0].text;
        const lastComicDateString = lastTweetText?.split(' ')[0];
        const lastComicDate = new Date(lastComicDateString);

        // The "next comic date" is lastComicDate + 1 day:
        const nextComicDate = addDays(lastComicDate, 1);

        // Format the date (YYYYMMDD) to match your filename.
        const year = nextComicDate.getFullYear().toString();
        const month = String(nextComicDate.getMonth() + 1).padStart(2, '0');
        const day = String(nextComicDate.getDate()).padStart(2, '0');

        // Construct the filename, e.g. "19851119.gif"
        const filename = `${year}${month}${day}.gif`;

        // Build the full path to your file: "../comics/YYYY/MM/YYYYMMDD.gif"
        // Adjust this path structure as needed for your project
        const filePath = path.join('comics', year, month, filename);

        // 3) Upload the media
        // twitter-api-v2 v1 upload
        const mediaId = await client.v1.uploadMedia(filePath, { mimeType: 'image/png' });

        // 4) Tweet with the uploaded media
        const tweetText = `${month}/${day}/${year}`; // E.g. "11/19/1985"

        // Using v2 tweet
        const { data: createdTweet } = await client.v2.tweet({
            text: tweetText,
            media: { media_ids: [mediaId] },
        });

        console.log('Successfully created tweet with ID:', createdTweet.id);
    } catch (error) {
        console.error('Error in tweetNextComic:', error);
    }
}
