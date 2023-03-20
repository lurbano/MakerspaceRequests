from tinydb import TinyDB, Query, table
import sys 
import json
import re

from jobDBs import *

#db = TinyDB('db.json')
# NOTE
# database names are set in jobDBs.py

data = {}


        

for line in sys.stdin:
    #sys.stdout.write(line)
    # print("line:", line)
    d = json.loads(line)

    if d["action"] == "insert":
        #print("value", d['value'])
        #v = json.loads(d['value'])
        v = d["value"]
        
        # # initialize db
        jobDb = jobDBs()
        data['n'] = jobDb.setupDb()
        data['id'] = jobDb.id
        


    if d["action"] == "update":
        v = d["value"]
        #q = Query()
        data["id"] = v["id"]
        data["val"] = v
        #db.upsert(table.Document(v, doc_id = v["id"]))
        #db.update(v, q.id == v["id"])

        # update specific job database
        id = d['value']["id"]
        jobDb = jobDBs(id)
        n = jobDb.update(d['value'])
        data['n'] = n





    if d["action"] == "getAll":
        data["values"] = idDB.all()



    if d["action"] == "getByQuery":
        if (d["value"] == 'all'):
            data["values"] = idDB.all()
        else:
            q = Query()
            data['values'] = idDB.search(q[d["key"]] == d["value"])




    if d["action"] == "getJobByID": #***
        # data['id'] = d['value']['id']
        # q = Query()
        # data['job'] = db.search(q.id == int(data['id']))

        id = d['value']["id"]
        jobDb = jobDBs(id)
        #q = Query()
        data['job'] = jobDb.getEntry()
        data['id'] = id



    if d["action"] == "removeJobByID":
        data['id'] = d['value']['id']
        q = Query()
        # Remove only from idDB database. 
        #   Keep directory with data in case we need to undelete.
        data['removed'] = idDB.remove(q.id == int(data['id']))

    if d['action'] == "searchText":
        txt = d['value']
        records = idDB.all()
        outList = []
        for r in records:
            s = json.dumps(r)
            if re.search(txt, s, re.IGNORECASE):
                outList.append(r)
        data['values'] = outList



    print(json.dumps(data));

    