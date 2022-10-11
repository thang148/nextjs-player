import s from "./ScrollToTop.module.css"
import cn from "classnames"
import { useEffect, useState } from "react"

let check = false
export default function ScrollToTop() {
  const [show, setShow] = useState(false)

  function toTop() {
    window.scroll({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const scrollFunction = () => {
      let isShow = false
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        isShow = true
      } else {
        isShow = false
      }
      if (isShow !== check) {
        setShow(isShow)
        check = isShow
      }
    }
    window.addEventListener("scroll", scrollFunction)
    return () => window.removeEventListener("scroll", scrollFunction)
  }, [])

  return (
    <button onClick={toTop} className={cn(s.btnScroll, show ? s.blockBtn : s.hiddentBtn)} title="Go to top">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}
