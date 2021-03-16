import pandas as pd
import pytz
import json
import logging

from datetime import datetime
from datetime import timedelta

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    logger.info(f'event = {event}')

    data = pd.read_csv(
        './110中華民國政府行政機關辦公日曆表.csv', 
        index_col = '西元日期',
        encoding = 'big5'
    )

    # print(data.columns)
    # print(data.index)

    tz = pytz.timezone('Asia/Taipei')

    today = datetime.now(tz)
    # print(today)

    # tomorrow = today + timedelta(days = 1)
    # print(tomorrow)

    # day = data.loc[int(tomorrow.strftime("%Y%m%d"))]
    day = data.loc[int(today.strftime("%Y%m%d"))]
    
    if day['是否放假'] == 0:
        data = {
            # 'result': "明天要上班哦～",
            'result': "今天要上班哦～",
            'workingDay': True,
            'datetime': today.isoformat()
        }
    elif day['是否放假'] == 2:
        data = {
            # 'result': "明天放假囉！",
            'result': "今天放假囉！",
            'workingDay': False,
            'datetime': today.isoformat()
        }
    else:
        data = {
            'result': "出現了一些錯誤兒...",
            'datetime': today.isoformat()
        }

    logger.info(f'data = {data}')

    result = {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    
    # result = json.dumps(data)

    return result
