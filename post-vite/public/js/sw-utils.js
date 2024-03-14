function manageApiNotes(cacheName, req) {
  if (req.clone().method === "POST") {
    if (self.registration.sync) {
      // if offline  mode  is enabled
      return req
        .clone()
        .text()
        .then((body) => {
          const bodyObj = JSON.parse(body)
          return saveNote(bodyObj)
        })
    } else {
      return fetch(req) //online
    }
  } else {
    return fetch(req)
      .then((resp) => {
        if (resp.ok) {
          updateDynamicCache(cacheName, req, resp.clone()) //store notes from get request
          return resp.clone()
        } else {
          return caches.match(req) //retrive notees from cache
        }
      })
      .catch((err) => {
        return caches.match(req) || err //return error page or retrived data
        //return if exists in cache  otherwise network error
      })
  }
}
const updateDynamicCache = (dynamicCache, req, res) => {
  if (res.ok) {
    return caches.open(dynamicCache).then((cache) => {
      cache.put(req, res.clone())
      return res.clone()
    })
  } else {
    return res
  }
}
