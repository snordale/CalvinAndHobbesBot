import { addDays } from 'date-fns';
import { config } from 'dotenv';
import path from 'path';
import { TwitterApi } from 'twitter-api-v2';
config();

const USERNAME = 'CalvinB0t'

// Twitter API credentials
const consumerKey = process.env.CONSUMER_KEY!;
const consumerSecret = process.env.CONSUMER_SECRET!;
const accessToken = process.env.ACCESS_KEY!;
const accessSecret = process.env.ACCESS_SECRET!;

// Initialize Twitter client
const twitterClient = new TwitterApi({
    appKey: consumerKey,
    appSecret: consumerSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
});

const FIRST_TWEET_DATE = new Date(2021, 9, 6);

async function getLastTweetDate(): Promise<Date> {
    try {
        const tweets = await twitterClient.v2.userTimeline(process.env.BOT_USER_ID!, {
            max_results: 5,
            "tweet.fields": ["created_at"],
        });

        console.log('tweets', tweets)

        for (const tweet of tweets.data.data) {
            // Try to parse date from tweet text (format: M/D/YYYY)
            const match = tweet.text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (match) {
                const [_, month, day, year] = match;
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
        }
    } catch (error) {
        console.error('Error getting last tweet date:', error);
    }


    throw new Error('Error getting last tweet date');
}

export const followUsers = async (): Promise<void> => {
    try {
        const targetUser = 'Calvinn_Hobbes';
        const followers = await twitterClient.v2.followers(targetUser);

        for (const follower of followers.data.slice(50, 60)) {
            try {
                await twitterClient.v1.createFriendship({ user_id: follower.id });
                console.log(`Followed user: ${follower.username}`);
            } catch (error) {
                console.error(`Unable to follow user ${follower.username}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in followUsers:', error);
    }
};

export const tweetNextComic = async (): Promise<void> => {
    try {
        const lastTweetDate = await getLastTweetDate();
        const nextTweetDate = addDays(lastTweetDate, 1);

        const year = nextTweetDate.getFullYear();
        const month = nextTweetDate.getMonth() + 1;
        const day = nextTweetDate.getDate();

        const filename = `${year}${month}${day}.gif`;

        // Upload media
        const mediaId = await twitterClient.v1.uploadMedia(filename);

        // Create tweet
        const text = `${month}/${day}/${year}`;
        await twitterClient.v2.tweet({
            text,
            media: { media_ids: [mediaId] }
        });

        console.log('Successfully tweeted comic:', text);
    } catch (error) {
        console.error('Error in tweetNextComic:', error);
    }
}; 