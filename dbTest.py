from tinydb import TinyDB, Query, table
import sys 
import json

db = TinyDB('db.json')
q = Query()

#db.update({"email":"this"}, q.id == 2)
#db.update(table.Document({"email":"this"}, doc_id = 2))

db.update({"id": 1}, q.id == "1")
db.update(table.Document({"email":"this"}, doc_id = 2))

# x = db.remove(q.id == 3)
# print(x)

job = db.search(q.id == 1)
print(job);
