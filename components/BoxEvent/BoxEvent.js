/* eslint-disable jsx-a11y/anchor-is-valid */
import s from "./BoxEvent.module.css"
import { apiLiveScore } from "api"
import Image from "next/image"
import Link from "next/link"
import { renderStatus } from "lib/func"
import Dropdown from "components/Dropdown"

import { useEffect, useState, Fragment, useRef } from "react"

function convertTime() {
  const _date = new Date()
  const timezone = Math.abs(_date.getTimezoneOffset() / 60)
  const m = _date.getMonth() + 1
  const date = _date.getFullYear() + "-" + m + "-" + _date.getDate()
  return { timezone, date }
}

let mouseDown = false
let startX, scrollLeft

export default function BoxEvent() {
  const [rows, setRows] = useState([])

  const [leagues, setLeagues] = useState()
  const __list = useRef([])
  const __slider = useRef()
  async function getEvent() {
    try {
      const { data } = await apiLiveScore.getLiveSocres(convertTime())
      if (data?.length > 0) {
        __list.current = data
        setRows(data)
        let newList = [{ id: "all", name: "Tất cả giải" }]
        data.forEach((i) => {
          newList.push({ id: i.id, name: i.name })
        })
        setLeagues(newList)
      }
    } catch (e) {
      console.log(e)
    }
  }
  function onChangeLeague(v) {
    let _list
    if (v === "all") {
      _list = __list.current
      setRows(_list)
    } else {
      _list = __list.current.find((i) => i.id === v)
      setRows([_list])
    }
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
  useEffect(() => {
    mouseDown = false
    __slider.current.scrollLeft = 0
    getEvent()
  }, [])

  return (
    <article className={s.live}>
      <div className="">
        <Dropdown onChange={onChangeLeague} leagues={leagues} />
      </div>
      <div className={s.actionLeft}>
        <button className={s.action} onClick={onPrev}>
          {leftIc}
        </button>
      </div>
      <div
        className={s.boxLive}
        onMouseDown={startDragging}
        onMouseMove={onMouseMove}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        tabIndex="0"
        role="button"
        ref={__slider}
      >
        {rows?.length > 0 ? (
          rows?.map(({ matchs, short_name, id }) => {
            return (
              <div key={id} className="flex">
                {rows.length > 1 && <div className={s.league}>{short_name}</div>}
                <ItemEvent matchs={matchs} />
              </div>
            )
          })
        ) : (
          <div className="flex m-auto text-gray-500 items-center">Không có trận đấu trong ngày hôm nay.</div>
        )}
      </div>
      <div className={s.actionRight}>
        <button className={s.action} onClick={onNext}>
          {rightIc}
        </button>
      </div>
      <div className={s.full_livescore}>
        <Link href="/livescore">
          <a className="text-left">
            <div>Xem Full</div>
            <div className="flex items-center">
              <div className="mr-1">Livescore</div> {next}
            </div>
          </a>
        </Link>
      </div>
    </article>
  )
}

const ItemEvent = ({ matchs }) => {
  return (
    <Fragment>
      {matchs?.map((item, k) => {
        const {
          home_short_name,
          home_logo,
          away_short_name,
          away_logo,
          away_score,
          home_score,
          match_time,
          pen_score,
          home_name,
          away_name,
          time_status,
          status,
          id
        } = item
        const obj = renderStatus({ status, match_time, pen_score, time_status })
        return (
          <div className={s.itemLive} key={k}>
            <Link href={`/detail-livescore/${id}`}>
              <a className="text-white flex items-center">
                <div className={s.detail}>
                  <span>{eye}</span> Xem chi tiết
                </div>
              </a>
            </Link>
            <div className={`mb-1 text-gray-400 ${obj.class}`}>{obj.text}</div>
            <div className="flex mb-1 font-semibold">
              <div className={s.left}>
                <div className="flex space-x-1">
                  {!home_logo || home_logo.includes("zq.win007") ? (
                    <div>{iconTeamDf}</div>
                  ) : (
                    <Image src={home_logo} width={16} height={16} />
                  )}
                  <div>{home_short_name?.slice(0, 3) || home_name?.slice(0, 3)}</div>
                </div>
              </div>
              <div className={s.right}>{home_score}</div>
            </div>
            <div className="flex mb-1 font-semibold">
              <div className={s.left}>
                <div className="flex space-x-1">
                  {!away_logo || away_logo.includes("zq.win007") ? (
                    <div>{iconTeamDf}</div>
                  ) : (
                    <Image src={away_logo} width={16} height={16} />
                  )}
                  <div>{away_short_name?.slice(0, 3) || away_name?.slice(0, 3)}</div>
                </div>
              </div>
              <div className={s.right}>{away_score}</div>
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

const leftIc = (
  <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5465 14.1067L4.43984 8L10.5465 1.88L8.6665 0L0.666504 8L8.6665 16L10.5465 14.1067Z" fill="#636F82" />
  </svg>
)

const rightIc = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.4531 22.1067L17.5598 16L11.4531 9.88L13.3331 8L21.3331 16L13.3331 24L11.4531 22.1067Z"
      fill="#303B50"
    />
  </svg>
)
const eye = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const next = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
)

const iconTeamDf = (
  <svg id="Layer_1" width={16} height={16} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs></defs>
    <title>Placeholder_Club</title>
    <path
      fill="#c1c7d0"
      d="M186.85,35,153.72,0C118.8,21.67,100,18.33,100,18.33S81.2,21.67,46.28,0L13.15,35s7.32,4.68,12.61,15.42a47.71,47.71,0,0,1,3.29,16.7,102.53,102.53,0,0,1-2.25,17h0C19.32,109.71,12.11,170.78,100,200c87.89-29.22,80.68-90.29,73.2-115.85h0a102.53,102.53,0,0,1-2.25-17,47.71,47.71,0,0,1,3.29-16.7C179.53,39.68,186.85,35,186.85,35Z"
    />
    <path
      className="cls-2"
      d="M100,192.07l-.5-.18C23.41,165.33,25.81,114.31,34,86.26l.13-.5a110,110,0,0,0,2.42-18.27,54.78,54.78,0,0,0-3.86-20l-.2-.44a52.63,52.63,0,0,0-7.66-11.52l-.9-1,23.65-25,1,.58C76.79,26.2,94.51,26.38,99.87,25.91c1,.07,2,.12,3.22.12,7.62,0,24-2.06,48.3-15.9l1-.58,23.65,25-.91,1a53,53,0,0,0-7.65,11.52l-.21.47a55,55,0,0,0-3.86,19.68,109.75,109.75,0,0,0,2.43,18.53l.13.48c8.2,28.06,10.6,79.08-65.5,105.64ZM28,34.63a56.53,56.53,0,0,1,7.2,11.14l.17.34a58.26,58.26,0,0,1,4.19,21.48,112.64,112.64,0,0,1-2.49,18.82l-.17.69c-7.89,27-10.14,76,63.1,101.78,73.24-25.79,71-74.82,63.1-101.78l-.17-.69a112.27,112.27,0,0,1-2.5-19.07,58.18,58.18,0,0,1,4.08-20.93l.29-.64A56.53,56.53,0,0,1,172,34.63l-20.15-21.3c-28.49,16-46.45,16.07-52,15.58a26.89,26.89,0,0,1-3,.13C89.1,29,72.47,27,48.15,13.33Z"
    />
    <path fill="#fff" d="M65.13,98.15v14.64H90.77v10.28H65.13v20.18H52.32V87.87H94.17V98.15Z" />
    <path
      fill="#fff"
      d="M113.51,140.52a27.54,27.54,0,0,1-10.76-10.21,29.8,29.8,0,0,1,0-29.51,27.44,27.44,0,0,1,10.76-10.2,34.33,34.33,0,0,1,28.4-1.15,26,26,0,0,1,9.77,7.28l-8.22,7.59a17.72,17.72,0,0,0-13.93-6.49,18.53,18.53,0,0,0-9.18,2.26,16.05,16.05,0,0,0-6.29,6.29,19.83,19.83,0,0,0,0,18.35,16.05,16.05,0,0,0,6.29,6.29,18.43,18.43,0,0,0,9.18,2.26,17.62,17.62,0,0,0,13.93-6.57l8.22,7.6a25.52,25.52,0,0,1-9.81,7.35,32.49,32.49,0,0,1-13.05,2.53A31.84,31.84,0,0,1,113.51,140.52Z"
    />
    <path
      className="cls-2"
      d="M109.9,47.1A14,14,0,1,0,114,57,13.92,13.92,0,0,0,109.9,47.1Zm-9.08.65,3.31-2.4A12.43,12.43,0,0,1,110.18,50L109,53.68l-4.22,1.37-3.94-2.86Zm-4.95-2.4,3.31,2.4v4.44l-3.94,2.86L91,53.68,89.82,50A12.43,12.43,0,0,1,95.87,45.35ZM90.45,64.84a12.36,12.36,0,0,1-2.81-7.51l2.87-2.09,4.22,1.37,1.51,4.64-2.61,3.59Zm13.67,3.81a12.31,12.31,0,0,1-8.24,0L95,65.8l2.6-3.59h4.88L105,65.8Zm5.43-3.81h-3.18l-2.61-3.59,1.51-4.64,4.22-1.37,2.86,2.09A12.29,12.29,0,0,1,109.55,64.84Z"
    />
  </svg>
)
