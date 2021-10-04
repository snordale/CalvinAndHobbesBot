import os, tweepy

from datetime import date, timedelta


CONSUMER_KEY=os.environ['CONSUMER_KEY']
CONSUMER_SECRET=os.environ['CONSUMER_SECRET']
ACCESS_SECRET=os.environ['ACCESS_SECRET']
ACCESS_KEY=os.environ['ACCESS_KEY']

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
api = tweepy.API(auth)

def get_prev_comic():
    with open('prev_comic.txt', 'r') as file:
        return file.read(8)

def set_prev_comic(filename):
    with open('prev_comic.txt', 'r+') as file:
        return file.write(filename)

def tweet_next_comic():
    prev_comic = get_prev_comic()

    if prev_comic:
        year = int(prev_comic[0:4])
        month = int(prev_comic[4:6])
        day = int(prev_comic[6:8])
        new_date = date(year=year, month=month, day=day) + timedelta(days=1)
    else:
        new_date = date(year=1985, month=11, day=18)

    new_day = new_date.strftime('%d')
    new_filename = f'{new_date.year}{new_date.month}{new_day}.gif'
    
    filename = f'comics/{new_date.year}/{new_date.month}/{new_filename}'

    media = api.media_upload(filename=filename, chunked=True)
    text = f'{new_date.month}/{new_day}/{new_date.year}'

    api.update_status(status=text, media_ids=[media.media_id])

    set_prev_comic(f'{new_date.year}{new_date.month}{new_day}')
