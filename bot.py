import os, tweepy

from datetime import datetime

from comic_dict import comic_dict


CONSUMER_KEY=os.environ['CONSUMER_KEY']
CONSUMER_SECRET=os.environ['CONSUMER_SECRET']
ACCESS_SECRET=os.environ['ACCESS_SECRET']
ACCESS_KEY=os.environ['ACCESS_KEY']

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
api = tweepy.API(auth)

first_day = datetime(2021, 10, 6)


def get_comic_index():
    return (datetime.now() - first_day).days

def tweet_next_comic():
    comic_index = get_comic_index()
    filename = comic_dict[comic_index]

    print(f"Comic {comic_index}: {filename}")

    year = int(filename[0:4])
    month = int(filename[4:6])
    day = int(filename[6:8])
    
    full_path = f'comics/{year}/{month}/{filename}'

    media = api.media_upload(filename=full_path, chunked=True)
    text = f'{month}/{day}/{year}'

    api.update_status(status=text, media_ids=[media.media_id])