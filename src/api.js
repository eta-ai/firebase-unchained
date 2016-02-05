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
    return new Promise((resolve, reject) => {
      ref.once('value', resolve, reject)
    })
  }
}

export function pval (db) {
  return (path) => db.pget(path)
    .then((snap) => {
      const val = snap.val()
      if (val === null) {
        throw new Error('No value at this path')
      }
      return val
    })
}

export function parray (db) {
  return (path) => db.pget(path)
    .then((snap) => {
      if (!snap.hasChildren()) {
        throw new Error('No child value at this path')
      }
      const results = []
      snap.forEach((childSnap) => {
        results.push(childSnap.val())
      })
      return results
    })
}

export function ppush (db) {
  return (path, value) => {
    const ref = path.push ? path : db.child(path)
    if (arguments.length < 2) {
      return Promise.resolve(ref.push())
    }
    return new Promise((resolve, reject) => {
      ref.push(value, (err) => err ? reject(err) : resolve())
    })
  }
}

export function pset (db) {
  return (path, value) => {
    const ref = path.set ? path : db.child(path)
    return new Promise((resolve, reject) => {
      ref.set(value, (err) => err ? reject(err) : resolve())
    })
  }
}

export function psetWithPriority (db) {
  return function (path, value, priority) {
    const ref = path.setWithPriority ? path : db.child(path)
    return new Promise(function (resolve, reject) {
      ref.setWithPriority(value, priority, function (err) {
        return err ? reject(err) : resolve()
      })
    })
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
    return new Promise((resolve, reject) => {
      ref.update(value, (err) => err ? reject(err) : resolve())
    })
  }
}

export function premove (db) {
  return (path) => {
    const ref = path.remove ? path : db.child(path)
    return new Promise((resolve, reject) => {
      ref.remove((err) => err ? reject(err) : resolve())
    })
  }
}

export function generateId (db) {
  return (path = '/') => {
    const ref = path.push ? path : db.child(path)
    return ref.push().key()
  }
}
