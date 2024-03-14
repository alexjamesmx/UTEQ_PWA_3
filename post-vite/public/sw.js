importScripts("https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js")
importScripts("js/sw-db.js")
importScripts("js/sw-utils.js")
//Crear las variables de cache
const CACHE_DYNAMIC = "dynamic-v1"
const CACHE_STATIC = "static-v3"
const CACHE_INMUTABLE = "inmutable-v1"
self.addEventListener("install", (event) => {
  const cahePromise = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll([
      "/",
      "/index.html",
      "/js/app.js",
      "/js/sw-utils.js",
      "/sw.js",
      "vite.svg",
      "/assets/index-DqfkWRLQ.js",
      "/assets/index-HeeXXGra.css",
    ])
  })
  const caheInmutable = caches.open(CACHE_INMUTABLE).then((cache) => {
    return cache.addAll([
      "https://fonts.googleapis.com/css2?family=Inter:wght@300&family=Roboto:wght@100&display=swap",
      "https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js",
    ])
  })
  event.waitUntil(Promise.all([cahePromise, caheInmutable]))
})

self.addEventListener("sync", (e) => {
  console.log("SW:sync")
  if (e.tag === "offline-post") {
    e.waitUntil(postNotes())
  }
})

self.addEventListener("activate", (evt) => {
  console.log("service worker activated")
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key !== CACHE_STATIC &&
              key !== CACHE_DYNAMIC &&
              key !== CACHE_INMUTABLE
          )
          .map((key) => caches.delete(key))
      )
    })
  )
})
self.addEventListener("fetch", (event) => {
  let fetchResponse
  if (event.request.url.includes("http://localhost:3001/api/note")) {
    fetchResponse = manageApiNotes(CACHE_DYNAMIC, event.request)
  } else {
    fetchResponse = caches.match(event.request).then((res) => {
      if (res) return res
      return fetch(event.request).then((newRes) => {
        return updateDynamicCache(CACHE_DYNAMIC, event.request, newRes)
      })
    })
  }
  event.respondWith(fetchResponse)
})
