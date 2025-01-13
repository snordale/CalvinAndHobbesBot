import { USER_ID, V1_BASE_URL } from "./constants";
import { getHeaders } from "./getHeaders";

export async function getLastTweetDate(): Promise<Date> {
    try {
        const response = await fetch(`${V1_BASE_URL}/users/${USER_ID}/tweets`, {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as any;
        const tweets = data.data;

        return new Date(tweets[0].text.split(' ')[0]);
    } catch (error) {
        console.error('Error getting last tweet date:', error);
    }

    throw new Error('Error getting last tweet date');
}