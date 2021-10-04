import os, shutil

from datetime import date, timedelta

source_dir = '/Users/samNordale/calvinBotHeroku/comics'
target_dir = '/Users/samNordale/calvinBotHeroku/all_comics'

single_digit_strings = ["dead", "01", "02", "03", "04", "05", "06", "07", "08", "09"]

for year in range(1985, 1996):
    for month in range(1, 13):
        for day in range(1, 32):
            day_string = single_digit_strings[day] if day < 10 else str(day)
            month_string = single_digit_strings[month] if month < 10 else str(month)
            filename = f'{source_dir}/{year}/{month_string}/{year}{month_string}{day_string}.gif'
            try:
                shutil.move(filename, target_dir)
            except Exception as e:
                print(e)
