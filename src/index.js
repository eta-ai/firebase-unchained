const api = require('./api')

module.exports = function unchainFirebase (db) {
  Object.keys(api).forEach(function (name) {
    const fn = api[name]
    db[name] = fn(db)
  })
  return db
}
