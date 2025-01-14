import TwitterApi from "twitter-api-v2";
import { USER_ID } from "./constants";

const creds = {
    appKey: process.env.X_API_KEY || '',
    appSecret: process.env.X_API_SECRET || '',
    accessToken: process.env.X_ACCESS_TOKEN || '',
    accessSecret: process.env.X_ACCESS_SECRET || '',
}

const client = new TwitterApi(creds);

export const followUsers = async (): Promise<void> => {
    try {
        console.log('Starting followUsers');
        // First get the target user's ID
        const userData = await client.v2.userByUsername('Calvinn_Hobbes');
        const targetUserId = userData.data.id;
        console.log(`Target user ID: ${targetUserId}`);

        // Get followers
        const followersData = await client.v2.followers(targetUserId, {
            max_results: 1000
        });
        console.log(`Followers data: ${followersData}`);

        // Take followers 50-60
        const followers = followersData.data.slice(50, 60);
        console.log(`Followers: ${followers}`);
        // Follow each user
        for (const follower of followers) {
            try {
                await client.v2.follow(USER_ID, follower.id);
                console.log(`Followed user: ${follower.username}`);
            } catch (error) {
                console.error(`Unable to follow user ${follower.username}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in followUsers:', error);
    }
};