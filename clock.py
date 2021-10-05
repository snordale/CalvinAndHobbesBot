from apscheduler.schedulers.blocking import BlockingScheduler

from bot import tweet_next_comic


sched = BlockingScheduler()

@sched.scheduled_job('cron', day_of_week='mon-sun', hour=16)
def scheduled_job():
    print("Tweeting next comic...")
    tweet_next_comic()

sched.start()