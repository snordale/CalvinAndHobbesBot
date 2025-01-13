import { API_BASE_URL, USER_ID } from "./constants";
import { getHeaders } from "./getHeaders";
import { UserResponse } from "./types";

export const followUsers = async (): Promise<void> => {
    try {
        // First get the target user's ID
        const userResponse = await fetch(`${API_BASE_URL}/users/by/username/Calvinn_Hobbes`, {
            headers: getHeaders()
        });

        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }

        const userData = await userResponse.json() as UserResponse;
        const targetUserId = userData.data.id;

        // Get followers
        const followersResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}/followers`, {
            headers: getHeaders()
        });

        if (!followersResponse.ok) {
            throw new Error(`HTTP error! status: ${followersResponse.status}`);
        }

        const followersData = await followersResponse.json() as any;
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