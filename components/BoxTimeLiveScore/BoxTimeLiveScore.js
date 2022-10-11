import React, { useEffect, useRef, useState } from "react"
import DatePicker from "react-datepicker"
import cn from "classnames"
import Cookies from "js-cookie"
import "react-datepicker/dist/react-datepicker.css"
import s from "./BoxTimeLive.module.css"
// import Dropdown from "components/Dropdown"

function toDay() {
  return new Date()
}

function getListDates(dateCurrent) {
  let dates = []
  for (let i = 14; i > 0; i--) {
    let item = new Date(dateCurrent)
    item.setDate(dateCurrent.getDate() - i)
    dates.push(item)
  }

  for (let i = 0; i < 14; i++) {
    let item = new Date(dateCurrent)
    item.setDate(dateCurrent.getDate() + i)
    dates.push(item)
  }
  return dates
}

function diffDate(d1, d2) {
  var t2 = d2.getTime()
  var t1 = d1.getTime()
  return parseInt((t2 - t1) / (24 * 3600 * 1000))
}

let mouseDown = false
let startX, scrollLeft

export default function BoxTimeLive({ fetch }) {
  const dateInit = Cookies.get("date")
  const __date = dateInit ? new Date(dateInit) : toDay()
  const [isRender, setIsRender] = useState(false)
  const [selected, setSelected] = useState(__date)
  const [listDates, setListDates] = useState(getListDates(__date))
  const __slider = useRef()

  function onClick() {
    const el = document.getElementsByClassName("react-datepicker__input-container")[0]
    el.childNodes[0].click()
  }

  function startDragging(e) {
    mouseDown = true
    startX = e.pageX - __slider.current.offsetLeft
    scrollLeft = __slider.current.scrollLeft
  }
  function stopDragging() {
    mouseDown = false
  }

  function onNext() {
    __slider.current.scrollTo({
      left: __slider.current.scrollLeft + 400,
      behavior: "smooth"
    })
  }
  function onPrev() {
    __slider.current.scrollTo({
      left: __slider.current.scrollLeft - 400,
      behavior: "smooth"
    })
  }
  function onMouseMove(e) {
    e.preventDefault()
    if (!mouseDown) {
      return
    }
    const x = e.pageX - __slider.current.offsetLeft
    const scroll = x - startX
    __slider.current.scrollLeft = scrollLeft - scroll
  }

  function onToday() {
    if (Math.abs(diffDate(listDates[14], toDay())) > 14) {
      setListDates(getListDates(toDay()))
    } else {
      if (window.innerWidth < 767) {
        __slider.current.scrollLeft = 830
      } else {
        __slider.current.scrollLeft = 683
      }
    }
    setSelected(toDay())
    fetch(toDay())
  }

  function onSelected(item) {
    if (scrollLeft === __slider.current.scrollLeft) {
      setSelected(item)
      fetch(item)
    }
  }

  function onChangeDate(value) {
    const count = diffDate(listDates[0], value)
    if (Math.abs(diffDate(listDates[14], value)) > 14) {
      setListDates(getListDates(value))
    } else {
      let __count = count
      if (count < 4 || count < 24) {
        __count = window.innerWidth > 767 ? count - 2 : count - 1
      }
      __slider.current.scrollLeft = __count * 64
    }
    setSelected(value)
    fetch(value)
  }

  useEffect(() => {
    setTimeout(() => {
      if (window.innerWidth < 767) {
        __slider.current.scrollLeft = 840
      } else {
        __slider.current.scrollLeft = 683
      }
    }, 300)
  }, [listDates])

  useEffect(() => {
    if (window) {
      const el = document.getElementsByClassName("react-datepicker__input-container")[0]
      el.childNodes[0].style.display = "none"
      setIsRender(true)
    }
    mouseDown = false
    window.addEventListener("beforeunload", () => {
      Cookies.remove("date")
    })
    return () => window.removeEventListener("beforeunload", null)
  }, [])

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <div className="mr-4 text-2xl text-dark-100 font-bold items-center flex">LIVESCORE </div>
        </div>
        {/* <Dropdown onChange={onChangeLeague} leagues={convertLeagues(leagues)} /> */}
      </div>
      <div className="flex w-full">
        <div className="flex items-center justify-center">
          <button
            onClick={onToday}
            className={cn("border border-dark-500 rounded text-xs p-1 px-2 mr-2 md:mr-8", {
              "bg-dark-500": selected.getDate() === toDay().getDate()
            })}
          >
            HÔM NAY
          </button>
        </div>
        <div className={s.f_w}>
          <div
            className={s.boxLive1}
            onMouseDown={startDragging}
            onMouseMove={onMouseMove}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            ref={__slider}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center absolute left-0 top-0 h-full">
              <button className={cn("flex items-center h-full", s.box_action, s.bg_left)} onClick={onPrev}>
                {leftIc}
              </button>
            </div>
            {listDates.map((item, k) => {
              return (
                <button
                  key={k}
                  className={cn("text-sm p-2 text-center", {
                    [`font-bold  text-white`]: item.getDate() === selected.getDate()
                  })}
                  onClick={() => onSelected(item)}
                >
                  <div className="w-12">{convertDay(item.getDay())}</div>
                  <div>
                    {/* {item.getDate()}/{item.getMonth() + 1} */}
                    {renderTime(item)}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="flex items-center absolute right-0 top-0 h-full">
            <button className={cn("flex items-center h-full", s.box_action, s.bg_right)} onClick={onNext}>
              {rightIc}
            </button>
          </div>
        </div>

        <button onClick={onClick} className="ml-2 md:ml-8">
          {calendar}
        </button>
        <div id="id" style={{ display: isRender ? "block" : "none" }}>
          <DatePicker dateFormat="dd/MM/yyy" selected={selected} onChange={onChangeDate} />
        </div>
      </div>
    </div>
  )
}
const calendar = (
  <svg width="48" height="28.8" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.1386 3.53645H17.3926V2.78125C17.3926 2.34977 17.043 2 16.6117 2C16.1804 2 15.8308 2.34977 15.8308 2.78125V3.53645H8.16913V2.78125C8.16913 2.34977 7.81952 2 7.38823 2C6.95693 2 6.60732 2.34977 6.60732 2.78125V3.53645H5.86137C3.7322 3.53645 2 5.26941 2 7.39949V18.1369C2 20.267 3.7322 22 5.86137 22H18.1387C20.2678 22 22 20.267 22 18.1369V7.39949C22 5.26941 20.2678 3.53645 18.1386 3.53645ZM5.86137 5.09895H6.60732V6.62238C6.60732 7.05387 6.95693 7.40363 7.38823 7.40363C7.81952 7.40363 8.16913 7.05387 8.16913 6.62238V5.09895H15.8309V6.62238C15.8309 7.05387 16.1805 7.40363 16.6118 7.40363C17.0431 7.40363 17.3927 7.05387 17.3927 6.62238V5.09895H18.1387C19.4066 5.09895 20.4382 6.13098 20.4382 7.39949V8.14582H3.5618V7.39949C3.5618 6.13098 4.59338 5.09895 5.86137 5.09895ZM18.1386 20.4375H5.86137C4.59338 20.4375 3.5618 19.4055 3.5618 18.1369V9.70832H20.4382V18.1369C20.4382 19.4055 19.4066 20.4375 18.1386 20.4375ZM8.93703 12.7812C8.93703 13.2127 8.58742 13.5625 8.15613 13.5625H6.62036C6.18907 13.5625 5.83946 13.2127 5.83946 12.7812C5.83946 12.3498 6.18907 12 6.62036 12H8.15613C8.58738 12 8.93703 12.3498 8.93703 12.7812ZM18.1606 12.7812C18.1606 13.2127 17.811 13.5625 17.3797 13.5625H15.8439C15.4126 13.5625 15.063 13.2127 15.063 12.7812C15.063 12.3498 15.4126 12 15.8439 12H17.3797C17.8109 12 18.1606 12.3498 18.1606 12.7812ZM13.5444 12.7812C13.5444 13.2127 13.1947 13.5625 12.7634 13.5625H11.2277C10.7964 13.5625 10.4468 13.2127 10.4468 12.7812C10.4468 12.3498 10.7964 12 11.2277 12H12.7634C13.1947 12 13.5444 12.3498 13.5444 12.7812ZM8.93703 17.3906C8.93703 17.8221 8.58742 18.1719 8.15613 18.1719H6.62036C6.18907 18.1719 5.83946 17.8221 5.83946 17.3906C5.83946 16.9591 6.18907 16.6094 6.62036 16.6094H8.15613C8.58738 16.6094 8.93703 16.9591 8.93703 17.3906ZM18.1606 17.3906C18.1606 17.8221 17.811 18.1719 17.3797 18.1719H15.8439C15.4126 18.1719 15.063 17.8221 15.063 17.3906C15.063 16.9591 15.4126 16.6094 15.8439 16.6094H17.3797C17.8109 16.6094 18.1606 16.9591 18.1606 17.3906ZM13.5444 17.3906C13.5444 17.8221 13.1947 18.1719 12.7634 18.1719H11.2277C10.7964 18.1719 10.4468 17.8221 10.4468 17.3906C10.4468 16.9591 10.7964 16.6094 11.2277 16.6094H12.7634C13.1947 16.6094 13.5444 16.9591 13.5444 17.3906Z"
      fill="#CCCCCC"
    />
    <path
      d="M35.1999 9.33325H28.7999C28.6327 9.35115 28.4739 9.41524 28.3411 9.51835C28.2083 9.62146 28.1068 9.75951 28.0481 9.91703C27.9893 10.0746 27.9756 10.2453 28.0084 10.4102C28.0412 10.5751 28.1193 10.7276 28.2339 10.8506L31.4339 14.4059C31.5038 14.4879 31.5907 14.5538 31.6885 14.5989C31.7864 14.6441 31.8928 14.6675 32.0006 14.6675C32.1083 14.6675 32.2148 14.6441 32.3126 14.5989C32.4105 14.5538 32.4973 14.4879 32.5672 14.4059L35.7672 10.8506C35.8819 10.7275 35.96 10.5749 35.9927 10.4099C36.0255 10.2449 36.0116 10.0741 35.9527 9.9165C35.8938 9.75895 35.7922 9.62092 35.6592 9.5179C35.5262 9.41488 35.3672 9.35094 35.1999 9.33325ZM31.9999 13.7779L28.7999 10.2226H35.1999L31.9999 13.7779Z"
      fill="#CCCCCC"
    />
  </svg>
)
const leftIc = (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.91 16.58L11.33 12L15.91 7.41L14.5 6L8.5 12L14.5 18L15.91 16.58Z" fill="white" fillOpacity="0.38" />
    <rect x="1" y="0.5" width="23" height="23" rx="11.5" stroke="white" strokeOpacity="0.38" />
  </svg>
)

const rightIc = (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.09003 16.58L13.67 12L9.09003 7.41L10.5 6L16.5 12L10.5 18L9.09003 16.58Z"
      fill="white"
      fillOpacity="0.38"
    />
    <rect x="1" y="0.5" width="23" height="23" rx="11.5" stroke="white" strokeOpacity="0.6" />
  </svg>
)

function convertDay(day) {
  if (day === 0) return "CN"
  const _day = day + 1
  return "THỨ " + _day
}

function renderTime(item) {
  const day = item.getDate() < 10 ? "0" + item.getDate() : item.getDate()
  const __month = item.getMonth() + 1
  const month = __month < 10 ? "0" + __month : __month
  return day + "/" + month
}
