from tinydb import TinyDB, Query, table
import os
import os.path
import time

idDB = TinyDB("idDB.json")


# records = idDB.all()
# record = idDB.search(q.id == 26)
# print(record)
# print(record[0]['rUploadedFileList'])

def updateFiles(db, record):
    try:
        id = record['id']
        upfiles = []
        for f in record['rUploadedFileList']:
            #print(f)

            # check if thumbnail exists
            print(f['filename'])
            thName = f"jobs/{id}/uploads/th_{f['filename']}"
            thExists = os.path.exists(thName)
            print("thName:", thExists, thName)
            if (thExists):
                f['thumb'] = 1
            else:
                f['thumb'] = 0
            
            upfiles.append(f)
        print(id, record['rUploadedFileList']) 
        print(upfiles)
        q = Query()
        n = db.update({'rUploadedFileList': upfiles}, q.id == id)
        print("n:", n)
    except Exception as e:
        print("no files")
        print(e)


for record in idDB:
    print()
    print(record)
    updateFiles(idDB, record)
    
    # try:
    #     id = record['id']
    #     subDB = TinyDB(f'jobs/{id}/{id}_db.json')
    #     for subRecord in subDB:
    #         updateFiles(subDB, subRecord)
    # except Exception as e:
    #     print("Error: subDB")
    #     print(e)

            
    
