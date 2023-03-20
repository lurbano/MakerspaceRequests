from tinydb import TinyDB, Query, table
import os
import time

idDB = TinyDB("idDB.json")

records = idDB.all()
outList = []
print(type(records), type(outList))
