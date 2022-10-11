let isVisivle = false
let toast = typeof window !== "undefined" && document.getElementById("toast-root")
function addNotification({ isSuccess, message }) {
  if (isVisivle) return
  toast.innerHTML = message
  if (isSuccess) {
    toast.classList.add("toast", "toat_success")
  } else {
    toast.classList.add("toast", "toat_error")
  }
  isVisivle = true
}

if (toast) {
  toast.addEventListener("animationend", () => {
    toast.innerHTML = ""
    toast.className = ""
    isVisivle = false
  })
}

const notification = {
  success: ({ message }) => {
    addNotification({ message, isSuccess: true })
  },
  error: ({ message }) => {
    addNotification({ message, isSuccess: false })
  }
}

export default notification
