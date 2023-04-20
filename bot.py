import os, tweepy

from datetime import datetime

from comic_dict import comic_dict

PROD = os.environ.get('PROD') == 'true'

if PROD:
    # Production environment, load variables from os.environ
    CONSUMER_KEY = os.environ.get('CONSUMER_KEY')
    CONSUMER_SECRET = os.environ.get('CONSUMER_SECRET')
    ACCESS_SECRET = os.environ.get('ACCESS_SECRET')
    ACCESS_KEY = os.environ.get('ACCESS_KEY')
else:
    # Development environment, load variables from .env file
    from dotenv import load_dotenv
    load_dotenv()
    CONSUMER_KEY = os.getenv('CONSUMER_KEY')
    CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
    ACCESS_SECRET = os.getenv('ACCESS_SECRET')
    ACCESS_KEY = os.getenv('ACCESS_KEY')

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)

twitterV1 = tweepy.API(auth)

twitterV2 = tweepy.Client(
    consumer_key=CONSUMER_KEY,
    consumer_secret=CONSUMER_SECRET,
    access_token=ACCESS_KEY, 
    access_token_secret=ACCESS_SECRET
    )


first_day = datetime(2021, 10, 6)


def follow_users():
    targetUser = 'Calvinn_Hobbes'
    # targetId = '1579422614'

    followerIds = twitterV1.get_follower_ids(screen_name=targetUser)
    for id in followerIds[50:60]:
        try:
            twitterV1.create_friendship(user_id=id)
        except:
            print('Unable to follow: ', id)



def get_comic_index():
    return (datetime.now() - first_day).days

def tweet_next_comic():
    comic_index = get_comic_index()
    filename = comic_dict[comic_index]

    print(f"Comic {comic_index}: {filename}")
	
    year = filename[0:4]
    month = filename[4:6]
    day = filename[6:8]

    full_path = f'comics/{year}/{month}/{filename}'

    # if PROD:
    media = twitterV1.media_upload(filename=full_path, chunked=True)
    # else:
    #     print('Upload Media from: ' + full_path)

    text = f'{int(month)}/{int(day)}/{int(year)}'

    # if PROD:
    twitterV1.update_status(status=text, media_ids=[media.media_id])
    # else:
    #     print('Send Tweet w/ text: ' + text)