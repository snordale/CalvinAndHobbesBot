import { USER_ID } from "./constants";
import { xClient } from "./xClient";

export const followUsers = async (): Promise<void> => {
    try {
        console.log('Starting followUsers');

        // First get the target user's ID
        const userData = await xClient.v2.userByUsername('Calvinn_Hobbes');

        console.log(`Got user: `, userData.data);

        const targetUserId = userData.data.id;

        // Get followers
        const followersData = await xClient.v1.userFollowerIds({
            user_id: targetUserId,
            cursor: '50',
            'count': 10
        });
        console.log(`Followers data: ${followersData.data}`);

        const followerIds = followersData.data.ids;

        // Take followers 50-60
        console.log(`followerIds: ${followerIds}`);
        // Follow each user
        for (const id of followerIds) {
            try {
                await xClient.v2.follow(USER_ID, id);
            } catch (error) {
                console.error(`Unable to follow user ${id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in followUsers:', error);
    }
};