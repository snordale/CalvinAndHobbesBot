import { addDays } from 'date-fns';
import path from 'path';
import { USER_ID } from './constants';
import { xClient } from './xClient';
import { getLastComicDate, updateLastComicDate } from './db';

/**
 * The main function that calculates the date, reads the comic file,
 * uploads the media, and tweets with that media attached.
 */
export async function tweetNextComic(): Promise<void> {
    try {
        // Get the last comic date from our database
        const lastComicDateString = await getLastComicDate();
        const [lastMonth, lastDay, lastYear] = lastComicDateString.split('/');
        const lastComicDate = new Date(parseInt(lastYear), parseInt(lastMonth) - 1, parseInt(lastDay));
        
        // The "next comic date" is lastComicDate + 1 day:
        const nextComicDate = addDays(lastComicDate, 1);

        // Format the date (YYYYMMDD) to match your filename
        const formattedYear = nextComicDate.getFullYear().toString();
        const formattedMonth = String(nextComicDate.getMonth() + 1).padStart(2, '0');
        const formattedDay = String(nextComicDate.getDate()).padStart(2, '0');

        // Construct the filename, e.g. "19851119.gif"
        const filename = `${formattedYear}${formattedMonth}${formattedDay}.gif`;
        
        // Build the full path to your file
        const filePath = path.join('comics', formattedYear, formattedMonth, filename);

        // Upload the media
        const mediaId = await xClient.v1.uploadMedia(filePath, { mimeType: 'image/png' });

        // Tweet with the uploaded media
        const tweetText = `${parseInt(formattedMonth)}/${parseInt(formattedDay)}/${formattedYear}`; // E.g. "1/19/1986"

        try {
            const { data: createdTweet } = await xClient.v2.tweet({
                text: tweetText,
                media: { media_ids: [mediaId] },
            });
            
            console.log(`Posted comic for ${tweetText}: https://twitter.com/user/status/${createdTweet.id}`);
            await updateLastComicDate(tweetText);
        } catch (error) {
            console.error('Failed to post tweet:', error instanceof Error ? error.message : String(error));
            throw error;
        }

    } catch (error) {
        console.error('Error in tweetNextComic:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
