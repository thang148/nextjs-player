import { useEffect, useState, memo } from "react"
import { saveVolumn, getVolumn } from "lib/Cookies"
let __keyVolum = false
// eslint-disable-next-line react/display-name
const Volumn = memo(({ onChange, initValue }) => {
  const [showVolum, setShowVolum] = useState(false)

  function onMouseDownVolum(e) {
    e.stopPropagation()
    __keyVolum = true
  }

  function onMouseUpVolum(e) {
    __keyVolum = false
    setVolum(e)
  }
  function onChangeShowColum(e) {
    e.stopPropagation()
    setShowVolum(true)
  }

  function setVolum(e) {
    e.stopPropagation()
    const el = document.getElementById("volum")
    const iconVolum = document.getElementById("icon_volum")
    const volum = el.getBoundingClientRect()
    let value = e.clientX - volum.x
    if (value > 90) value = 90
    if (value < 0) value = 0
    const __value = value === 0 ? 0 : (value / 90).toFixed(3)
    el.style.backgroundSize = `${__value * 100}% 100%`
    iconVolum.style.transform = `translateX(${value}px)`
    onChange(__value)
    saveVolumn(__value)
  }

  function onMouseMove(e) {
    e.stopPropagation()
    if (__keyVolum) {
      setVolum(e)
    }
  }
  function onChangeVolum() {
    const el = document.getElementById("volum")
    const iconVolum = document.getElementById("icon_volum")
    if (initValue > 0) {
      onChange(0)
      saveVolumn(0)
      el.style.backgroundSize = `0% 100%`
      iconVolum.style.transform = `translateX(0px)`
    } else {
      onChange(0.8)
      saveVolumn(0.8)
      el.style.backgroundSize = `80% 100%`
      iconVolum.style.transform = `translateX(72px)`
    }
  }

  function onMouseLeave() {}

  useEffect(() => {
    const el = document.getElementById("volum")
    const iconVolum = document.getElementById("icon_volum")
    el.style.backgroundSize = `${getVolumn() * 100}% 100%`
    iconVolum.style.transform = `translateX(${getVolumn() * 90}px)`
    window.addEventListener("mousemove", onMouseMove)
    function onMouseLeave(e) {
      e.stopPropagation()
      __keyVolum = false
      setShowVolum(false)
    }
    const controlBar = document.getElementById("control__bar")
    if (controlBar) {
      window.addEventListener("mousemove", onMouseMove)
      controlBar.addEventListener("mouseleave", onMouseLeave)
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      controlBar.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div className={`flex __slide_volum ${showVolum ? "show_volum" : ""}`} onMouseOver={onChangeShowColum}>
      <button onClick={onChangeVolum} className="__icon">
        {initValue === 0 ? icVolumOff : icVolum}
      </button>
      <div
        role="button"
        tabIndex="0"
        className="wapper__line__volum"
        onMouseDown={onMouseDownVolum}
        onMouseUp={onMouseUpVolum}
        onMouseLeave={onMouseLeave}
      >
        <div className="line__volum__full" id="volum">
          <div className="circle__volum" id="icon_volum"></div>
        </div>
      </div>
    </div>
  )
})

export default Volumn
const icVolum = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.2182 7.22389C15.4497 7.31988 15.6475 7.48235 15.7867 7.69076C15.9258 7.89917 16.0001 8.14417 16 8.39478V23.6011C16 23.8517 15.9256 24.0966 15.7864 24.3049C15.6471 24.5133 15.4492 24.6756 15.2177 24.7715C14.9862 24.8674 14.7315 24.8925 14.4857 24.8436C14.2399 24.7948 14.0141 24.6741 13.8369 24.497L9.13945 19.7995H5.8625C5.52642 19.7995 5.2041 19.666 4.96646 19.4283C4.72881 19.1907 4.59531 18.8684 4.59531 18.5323V13.4635C4.59531 13.1275 4.72881 12.8051 4.96646 12.5675C5.2041 12.3299 5.52642 12.1963 5.8625 12.1963H9.13945L13.8369 7.49888C14.0141 7.32155 14.24 7.20078 14.4858 7.15183C14.7317 7.10288 14.9866 7.12796 15.2182 7.22389Z"
      fill="#E6E6E6"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.9013 7.03752C22.139 6.79996 22.4612 6.6665 22.7972 6.6665C23.1332 6.6665 23.4555 6.79996 23.6931 7.03752C24.8714 8.21303 25.8058 9.60973 26.4428 11.1474C27.0797 12.6851 27.4066 14.3334 27.4047 15.9978C27.4066 17.6622 27.0797 19.3106 26.4428 20.8482C25.8058 22.3859 24.8714 23.7826 23.6931 24.9581C23.4541 25.189 23.134 25.3167 22.8018 25.3138C22.4695 25.3109 22.1517 25.1776 21.9168 24.9427C21.6818 24.7077 21.5485 24.3899 21.5457 24.0577C21.5428 23.7254 21.6705 23.4053 21.9013 23.1663C22.8443 22.2261 23.5921 21.1088 24.1016 19.8785C24.6111 18.6483 24.8724 17.3294 24.8704 15.9978C24.8704 13.1973 23.7375 10.6655 21.9013 8.82933C21.6638 8.59169 21.5303 8.26944 21.5303 7.93342C21.5303 7.59741 21.6638 7.27515 21.9013 7.03752ZM18.3164 10.6211C18.4341 10.5033 18.5739 10.4098 18.7277 10.3461C18.8816 10.2823 19.0465 10.2495 19.213 10.2495C19.3795 10.2495 19.5444 10.2823 19.6982 10.3461C19.8521 10.4098 19.9918 10.5033 20.1095 10.6211C20.8165 11.3265 21.3771 12.1647 21.7592 13.0874C22.1412 14.0101 22.3373 14.9991 22.336 15.9978C22.3372 16.9965 22.1411 17.9856 21.7591 18.9083C21.377 19.8309 20.8164 20.6691 20.1095 21.3745C19.8717 21.6123 19.5492 21.7459 19.213 21.7459C18.8767 21.7459 18.5542 21.6123 18.3164 21.3745C18.0787 21.1367 17.9451 20.8142 17.9451 20.478C17.9451 20.1417 18.0787 19.8192 18.3164 19.5814C18.7881 19.1115 19.1621 18.553 19.417 17.938C19.6718 17.3229 19.8026 16.6636 19.8016 15.9978C19.8026 15.3321 19.6719 14.6727 19.417 14.0576C19.1622 13.4426 18.7881 12.8841 18.3164 12.4142C18.1986 12.2965 18.1052 12.1568 18.0414 12.0029C17.9776 11.8491 17.9448 11.6842 17.9448 11.5177C17.9448 11.3511 17.9776 11.1862 18.0414 11.0324C18.1052 10.8786 18.1986 10.7388 18.3164 10.6211Z"
      fill="#E6E6E6"
    />
  </svg>
)
const icVolumOff = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.9599 6.76299C16.1915 6.85901 16.3894 7.02153 16.5286 7.23002C16.6678 7.4385 16.7421 7.68359 16.742 7.93428V23.1458C16.742 23.3965 16.6676 23.6415 16.5283 23.8499C16.389 24.0583 16.1911 24.2208 15.9595 24.3167C15.7279 24.4126 15.473 24.4377 15.2272 24.3888C14.9813 24.3399 14.7555 24.2193 14.5782 24.042L9.87909 19.3429H6.601C6.26481 19.3429 5.94238 19.2094 5.70465 18.9717C5.46693 18.7339 5.33337 18.4115 5.33337 18.0753V13.0048C5.33337 12.6686 5.46693 12.3462 5.70465 12.1084C5.94238 11.8707 6.26481 11.7372 6.601 11.7372H9.87909L14.5782 7.03807C14.7555 6.86068 14.9814 6.73987 15.2273 6.6909C15.4733 6.64194 15.7282 6.66703 15.9599 6.76299Z"
      fill="#E6E6E6"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.6489 12.1087C19.8866 11.871 20.2089 11.7375 20.5451 11.7375C20.8812 11.7375 21.2036 11.871 21.4413 12.1087L23.0803 13.7477L24.7194 12.1087C24.8363 11.9876 24.9762 11.891 25.1308 11.8246C25.2855 11.7582 25.4518 11.7232 25.6201 11.7217C25.7885 11.7203 25.9554 11.7523 26.1112 11.8161C26.2669 11.8798 26.4085 11.9739 26.5275 12.093C26.6465 12.212 26.7406 12.3535 26.8044 12.5093C26.8681 12.6651 26.9002 12.832 26.8987 13.0003C26.8973 13.1686 26.8623 13.335 26.7959 13.4896C26.7294 13.6443 26.6329 13.7842 26.5118 13.9011L24.8727 15.5401L26.5118 17.1792C26.7427 17.4183 26.8705 17.7385 26.8676 18.0708C26.8647 18.4032 26.7314 18.7211 26.4963 18.9562C26.2613 19.1912 25.9434 19.3245 25.611 19.3274C25.2786 19.3303 24.9584 19.2025 24.7194 18.9716L23.0803 17.3326L21.4413 18.9716C21.2022 19.2025 20.882 19.3303 20.5496 19.3274C20.2173 19.3245 19.8993 19.1912 19.6643 18.9562C19.4293 18.7211 19.296 18.4032 19.2931 18.0708C19.2902 17.7385 19.4179 17.4183 19.6489 17.1792L21.2879 15.5401L19.6489 13.9011C19.4112 13.6634 19.2777 13.341 19.2777 13.0049C19.2777 12.6688 19.4112 12.3464 19.6489 12.1087Z"
      fill="#E6E6E6"
    />
  </svg>
)
