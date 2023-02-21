from tinydb import TinyDB, Query 
import argparse

db = TinyDB('db.json')

parser = argparse.ArgumentParser()
parser.add_argument("-i", "--insert", type=str, help = "insert row into db")
parser.add_argument("-g", "--getDB", type=str, help = "get full database")
parser.add_argument("-u", "--upsert", type=str, help = "update (upsert) by id")

args = parser.parse_args()

#print(args.insert, args.getDB)

if (args.insert):
    id = db.insert({})
    print(id)

if (args.upsert):
    q = Query()
    db.upsert()


