from tinydb import TinyDB, Query, table
import sys 
import json

db = TinyDB('db.json')
q = Query()

#db.update({"email":"this"}, q.id == 2)
#db.update(table.Document({"email":"this"}, doc_id = 2))

x = db.search(q.id == "2")
print(x)