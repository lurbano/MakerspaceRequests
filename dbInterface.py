from tinydb import TinyDB, Query, table
import sys 
import json

db = TinyDB('db.json')

data = {}

for line in sys.stdin:
    #sys.stdout.write(line)
    # print("line:", line)
    d = json.loads(line)
    if d["action"] == "insert":
        #print("value", d['value'])
        #v = json.loads(d['value'])
        v = d["value"]
        data["id"] = db.insert(v)
    if d["action"] == "update":
        v = d["value"]
        q = Query()
        data["id"] = v["id"]
        data["val"] = v
        db.upsert(table.Document(v, doc_id = v["id"]))
        #db.update(v, q.id == v["id"])
    if d["action"] == "getAll":
        data["values"] = db.all()



    print(json.dumps(data));

    