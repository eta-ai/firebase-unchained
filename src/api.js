export function pauthWithCustomToken (db) {
  return (token, options) => new Promise((resolve, reject) => {
    db.authWithCustomToken(token, (err, authData) => {
      if (err) {
        reject(err)
      } else {
        resolve(authData)
      }
    }, options)
  })
}

export function pget (db) {
  return (path) => {
    const ref = path.once ? path : db.child(path)
    return ref.once('value')
  }
}

export function pexportVal (db) {
  return (path) => db.pget(path)
    .then((snap) => snap.exportVal())
}

export function pval (db) {
  return (path) => db.pget(path)
    .then((snap) => snap.val())
}

export function parray (db) {
  return (path) => db.pget(path)
    .then((snap) => {
      const results = []
      snap.forEach((childSnap) => {
        results.push(childSnap.val())
      })
      return results
    })
}

export function ppush (db) {
  return function ppush (path, value) {
    const ref = path.push ? path : db.child(path)
    return ref.push(value)
  }
}

export function pset (db) {
  return (path, value) => {
    const ref = path.set ? path : db.child(path)
    return ref.set(value)
  }
}

export function psetWithPriority (db) {
  return function (path, value, priority) {
    const ref = path.setWithPriority ? path : db.child(path)
    return ref.setWithPriority(value, priority)
  }
}

export function psetPriority (db) {
  return (path, priority) => {
    const ref = path.setPriority ? path : db.child(path)
    return ref.setPriority(priority)
  }
}

export function pupdate (db) {
  return (path, value) => {
    const ref = path.update ? path : db.child(path)
    return ref.update(value)
  }
}

export function premove (db) {
  return (path) => {
    const ref = path.remove ? path : db.child(path)
    return ref.remove()
  }
}

export function generateId (db) {
  return (path = '/') => {
    const ref = path.push ? path : db.child(path)
    return ref.push().key()
  }
}

export function query (db) {
  return (path, options = {}) => {
    const ref = path.child ? path : db.child(path)
    return Object.keys(options).reduce((query, option) => {
      const value = options[option]
      return query[option](value)
    }, ref)
  }
}
