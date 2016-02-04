import * as api from './api'

export default function promisifyFirebase (db) {
  Object.keys(api).forEach((name) => {
    const fn = api[name]
    db[name] = fn(db)
  })
  return db
}
