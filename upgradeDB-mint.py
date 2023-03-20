from tinydb import TinyDB, Query, table
import sys 
import json
import os
import time
from jobDBs import *


olddb = TinyDB('db.json')
idDB = TinyDB("idDB.json")

os.popen('mkdir jobs')
os.popen('chmod 777 jobs')

records = olddb.all()

for record in records:
    if 'id' in record:
        print(int(record['id']))
        id = int(record['id'])

        # initialize idDb
        jobId = idDB.insert(table.Document(record, doc_id=id))

        # set up individual databases
        jobDB = jobDBs(id)
        jobDB.setupDb()
        jobDB.update(record)
        print(jobDB.dbName)

        # copy uploaded files
        oldDir = f'uploads/{id}/'
        print(oldDir, os.path.isdir(oldDir))
        if (os.path.isdir(oldDir)):
            os.popen(f'cp {oldDir}* {jobDB.uploadDir}')
        
        
os.popen(f'chown -R www-data:www-data jobs')
os.popen(f'chown -R www-data:www-data idDB.json')



        # db.insert(Document({'name': 'John', 'age': 22}, doc_id=12))
    # r = json.loads(record)
    # print(r)