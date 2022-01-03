db = db.getSiblingDB('kyrian-db');

db.createCollection('init_collection');

db.createUser(
  {
    user: "kyrian",
    pwd: "kyrian",
    roles: [ { role: "readWrite", db: "kyrian-db" } ]
  }
)