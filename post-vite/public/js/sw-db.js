const db = PouchDB("notas")
const server = "http://localhost:3001/api/note"

function postNotes() {
  const notas = []
  return db.allDocs({ include_docs: true }).then((docs) => {
    docs.rows.forEach((row) => {
      const doc = row.doc
      const obj = {
        title: doc.title,
        text: doc.text,
      }
      // sdfsdf
      const fetchProm = fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }).then((resp) => {
        return db.remove(doc) //delete all  local notes after syncing with the server, well get them when conection returns from get request
      })
      notas.push(fetchProm)
    })
    return Promise.all(notas)
  })
}
function saveNote(nota) {
  nota._id = new Date().toISOString()
  return db.put(nota).then(() => {
    self.registration.sync.register("offline-post") //sync offline post to server
    const newResp = { ok: true, offline: true }
    return new Response(JSON.stringify(newResp))
  })
}
