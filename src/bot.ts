import { addDays } from 'date-fns';
import { config } from 'dotenv';
import path from 'path';
config();

interface Tweet {
    text: string;
    created_at: string;
}

interface TwitterResponse<T> {
    data: T[];
}

interface UserResponse {
    data: {
        id: string;
    };
}

interface MediaResponse {
    media_id_string: string;
}

const USERNAME = 'CalvinB0t';
const USER_ID = '1180913705711816704';
const API_BASE_URL = 'https://api.twitter.com/2';

// Headers for authenticated requests
const headers = {
    'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    'Content-Type': 'application/json'
};

const FIRST_TWEET_DATE = new Date(2021, 9, 6);

async function getLastTweetDate(): Promise<Date> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${USER_ID}/tweets?max_results=10&tweet.fields=text,created_at`, {
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as TwitterResponse<Tweet>;
        const tweets = data.data;

        for (const tweet of tweets) {
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
        // First get the target user's ID
        const userResponse = await fetch(`${API_BASE_URL}/users/by/username/Calvinn_Hobbes`, {
            headers
        });
        
        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }

        const userData = await userResponse.json() as UserResponse;
        const targetUserId = userData.data.id;

        // Get followers
        const followersResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}/followers`, {
            headers
        });

        if (!followersResponse.ok) {
            throw new Error(`HTTP error! status: ${followersResponse.status}`);
        }

        const followersData = await followersResponse.json() as TwitterResponse<{ id: string; username: string }>;
        const followers = followersData.data.slice(50, 60);

        // Follow each user
        for (const follower of followers) {
            try {
                const followResponse = await fetch(`${API_BASE_URL}/users/${USER_ID}/following`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.TWITTER_OAUTH2_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        target_user_id: follower.id
                    })
                });

                if (followResponse.ok) {
                    console.log(`Followed user: ${follower.username}`);
                } else {
                    console.error(`Failed to follow user ${follower.username}`);
                }
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
        const formData = new FormData();
        formData.append('media', await fetch(filename).then(r => r.blob()));
        
        const mediaResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.TWITTER_OAUTH2_TOKEN}`
            },
            body: formData
        });

        if (!mediaResponse.ok) {
            throw new Error(`Failed to upload media: ${mediaResponse.status}`);
        }

        const mediaData = await mediaResponse.json() as MediaResponse;
        const mediaId = mediaData.media_id_string;

        // Create tweet
        const text = `${month}/${day}/${year}`;
        const tweetResponse = await fetch(`${API_BASE_URL}/tweets`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.TWITTER_OAUTH2_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                media: { media_ids: [mediaId] }
            })
        });

        if (!tweetResponse.ok) {
            throw new Error(`Failed to create tweet: ${tweetResponse.status}`);
        }

        console.log('Successfully tweeted comic:', text);
    } catch (error) {
        console.error('Error in tweetNextComic:', error);
    }
}; 