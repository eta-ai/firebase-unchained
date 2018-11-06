exports.pauthWithCustomToken = function (db) {
  return function pauthWithCustomToken (token, options) {
    return new Promise(function (resolve, reject) {
      db.authWithCustomToken(token, function (err, authData) {
        if (err) {
          reject(err)
        } else {
          resolve(authData)
        }
      }, options)
    })
  }
}

exports.pget = function (db) {
  return function pget (path) {
    const ref = path.once ? path : db.child(path)
    return ref.once('value')
  }
}

exports.pexportVal = function (db) {
  return function pexportVal (path) {
    return db.pget(path)
      .then(function (snap) {
        return snap.exportVal()
      })
  }
}

exports.pval = function (db) {
  return function pval (path) {
    return db.pget(path)
      .then(function (snap) {
        return snap.val()
      })
  }
}

exports.parray = function (db) {
  return function parray (path) {
    return db.pget(path)
      .then(function (snap) {
        const results = []
        snap.forEach(function (childSnap) {
          results.push(childSnap.val())
        })
        return results
      })
  }
}

exports.ppush = function (db) {
  return function ppush (path, value) {
    const ref = path.push ? path : db.child(path)
    return ref.push(value)
  }
}

exports.pset = function (db) {
  return function pset (path, value) {
    const ref = path.set ? path : db.child(path)
    return ref.set(value)
  }
}

exports.psetWithPriority = function (db) {
  return function (path, value, priority) {
    const ref = path.setWithPriority ? path : db.child(path)
    return ref.setWithPriority(value, priority)
  }
}

exports.psetPriority = function psetPriorityFromDb (db) {
  return function psetPriority (path, priority) {
    const ref = path.setPriority ? path : db.child(path)
    return ref.setPriority(priority)
  }
}

exports.pupdate = function (db) {
  return function pupdate (path, value) {
    const ref = path.update ? path : db.child(path)
    return ref.update(value)
  }
}

exports.premove = function (db) {
  return function premove (path) {
    const ref = path.remove ? path : db.child(path)
    return ref.remove()
  }
}

exports.generateId = function (db) {
  return function generateId (pathInput) {
    const path = pathInput || '/'
    const ref = path.push ? path : db.child(path)
    return ref.push().key()
  }
}

exports.query = function (db) {
  return function query (path, optionsInput) {
    const options = optionsInput || {}
    const ref = path.child ? path : db.child(path)
    return Object.keys(options).reduce(function (query, option) {
      const value = options[option]
      return typeof value === 'undefined'
        ? query[option]()
        : query[option](value)
    }, ref)
  }
}
