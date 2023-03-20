from tinydb import TinyDB, Query, table
import os
import time

idDB = TinyDB("idDB.json")

class jobDBs:
    def __init__(self, id=None):
        self.idDB = idDB # TinyDB("idDB.json")

        if (id == None): # initialize
            self.id = self.idDB.insert({})
        else:
            self.id = id
            
        self.dir = f'./jobs/{self.id}'
        self.uploadDir = f'{self.dir}/uploads'
        self.dbName = f'{self.dir}/{self.id}_db.json'

    def setupDb(self):
        os.mkdir(self.dir)
        os.mkdir(self.uploadDir)
        self.db = TinyDB(self.dbName)
        n = self.db.insert({})
        return n

    def getDb(self):
        return TinyDB(self.dbName)

    def update(self, data):
        data["time"] = time.localtime()
        
        # update this id's database
        db = self.getDb()
        n = db.insert(data)
        # update general database
        self.idDB.upsert(table.Document(data, doc_id = self.id))
        return n

    def getEntry(self, n=-1):
        db = self.getDb()
        record = db.all()[n]
        return record