if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/sw.js")
}

const isOnline = () => {
  if (navigator.onLine) {
    console.log("online")
  } else {
    console.log("offline")
  }
}

window.addEventListener("online", isOnline)
window.addEventListener("offline", isOnline)

isOnline()
