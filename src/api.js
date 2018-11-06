function isString(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
}

function ensureRef(db, pathOrRef) {
  return isString(pathOrRef) ? db.ref(pathOrRef) : pathOrRef;
}

exports.child = function(db) {
  return function child(path) {
    return db.ref(path);
  };
};

exports.generateId = function(db) {
  return function generateId(pathInput) {
    const path = pathInput || "/";
    return ensureRef(db, path).push().key;
  };
};

exports.parray = function(db) {
  return function parray(path) {
    return db.pget(path).then(function(snap) {
      const results = [];
      snap.forEach(function(childSnap) {
        results.push(childSnap.val());
      });
      return results;
    });
  };
};

exports.pexportVal = function(db) {
  return function pexportVal(path) {
    return db.pget(path).then(function(snap) {
      return snap.exportVal();
    });
  };
};

exports.pget = function(db) {
  return function pget(path) {
    return ensureRef(db, path).once("value");
  };
};

exports.ppush = function(db) {
  return function ppush(path, value) {
    return ensureRef(db, path).push(value);
  };
};

exports.premove = function(db) {
  return function premove(path) {
    return ensureRef(db, path).remove();
  };
};

exports.pset = function(db) {
  return function pset(path, value) {
    return ensureRef(db, path).set(value);
  };
};

exports.psetPriority = function psetPriorityFromDb(db) {
  return function psetPriority(path, priority) {
    return ensureRef(db, path).setPriority(priority);
  };
};

exports.psetWithPriority = function(db) {
  return function(path, value, priority) {
    return ensureRef(db, path).setWithPriority(value, priority);
  };
};

exports.pupdate = function(db) {
  return function pupdate(path, value) {
    return ensureRef(db, path).update(value);
  };
};

exports.pval = function(db) {
  return function pval(path) {
    return db.pget(path).then(function(snap) {
      return snap.val();
    });
  };
};

exports.query = function(db) {
  return function query(path, optionsInput) {
    const options = optionsInput || {};
    const ref = ensureRef(db, path);
    return Object.keys(options).reduce(function(query, option) {
      const value = options[option];
      return typeof value === "undefined"
        ? query[option]()
        : query[option](value);
    }, ref);
  };
};
