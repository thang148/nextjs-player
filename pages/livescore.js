/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Layout } from "components/common"
import { Loading } from "components/ui"
import "react-datepicker/dist/react-datepicker.css"
import { renderStatus } from "lib/func"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import axios from "axios"

const BoxTimeLiveScore = dynamic(() => import("components/BoxTimeLiveScore"), { ssr: false })

function convertTime(_date) {
  const timezone = Math.abs(_date.getTimezoneOffset() / 60)
  const m = _date.getMonth() + 1
  const date = _date.getFullYear() + "-" + m + "-" + _date.getDate()
  return { timezone, date }
}
export default function LiveScore() {
  const router = useRouter()
  const [row, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const __list = useRef([])

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

  async function fetch(date) {
    Cookies.set("date", date, { expires: 1 })
    try {
      setLoading(true)
      const { data } = await axios.get("/api/livescore", {
        params: convertTime(date)
      })
      console.log("vccc", data)
      if (data?.length > 0) {
        __list.current = data
        setRows(data)
      } else {
        __list.current = data
        setRows([])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function renderLink(e, video) {
    e.stopPropagation()
    // if (isMobile || isTablet) {
    const { type, id, videos, status } = video
    try {
      const params = {
        type: status === "live" ? type : videos[0].type,
        id: status === "live" ? id : videos[0].id
      }
      router.push(`/video?id=${params.id}&type=${params.type}`)
      // const { data } = await apiLiveScore.getLink(params)
      // window.open(data)
    } catch (error) {
      console.log(error)
    }
    // } else {
    //   setVisible(true)
    // }
  }

  useEffect(() => {
    const date = Cookies.get("date")
    const __d = date ? new Date(date) : new Date()
    fetch(__d)
  }, [])

  return (
    <main className="max-w-screen-md m-auto p-4  mb-8">
      <div className="text-dark-300 relative px-4 py-4">
        <Loading loading={loading}>
          <BoxTimeLiveScore fetch={fetch} onChangeLeague={onChangeLeague} leagues={__list.current} />
          <div className="mt-6">
            {row?.length > 0 ? (
              row?.map(({ name, logo, matchs }, k) => (
                <div key={k} className="mb-6">
                  <div className="mb-4 flex items-center">
                    {logo && logo.includes("http") && !logo?.includes("zq.win007") ? (
                      <Image src={logo} width={40} height={40} />
                    ) : (
                      <div>{iconCupDf}</div>
                    )}

                    <span className="font-bold ml-2">{name}</span>
                  </div>
                  {matchs?.length > 0 &&
                    matchs?.map((item, x) => {
                      const {
                        time_status,
                        home_logo,
                        home_name,
                        home_score,
                        away_logo,
                        away_name,
                        away_score,
                        match_time,
                        pen_score,
                        status,
                        id,
                        video
                      } = item
                      return (
                        <div
                          key={x}
                          className="shadow grid grid-cols-5 bg-dark rounded-xl mb-2 py-2 cursor-pointer hover:bg-dark-700"
                        >
                          <Link href={`detail-livescore/${id}`}>
                            <a className="text-dark-500">
                              <BoxTime obj={renderStatus({ status, match_time, pen_score, time_status })} />
                            </a>
                          </Link>
                          <Link href={`detail-livescore/${id}`}>
                            <div className="col-span-3">
                              <div className="flex justify-between mb-4">
                                <div className="flex items-center">
                                  {!home_logo || home_logo.includes("zq.win007") ? (
                                    <div>{iconTeamDf}</div>
                                  ) : (
                                    <Image src={home_logo} width={24} height={24} />
                                  )}
                                  <span className="ml-2">{home_name}</span>
                                </div>
                                <span className="font-bold text-darker">{status === 0 ? "-" : home_score}</span>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  {!away_logo || away_logo.includes("zq.win007") ? (
                                    <div>{iconTeamDf}</div>
                                  ) : (
                                    <Image src={away_logo} width={24} height={24} />
                                  )}
                                  <span className="ml-2">{away_name}</span>
                                </div>
                                <span className="font-bold">{status === 0 ? "-" : away_score}</span>
                              </div>
                            </div>
                          </Link>
                          <Link href={`detail-livescore/${id}`}>
                            <div className="col-span-1 ">
                              {video?.status === "finish" && video?.videos.length > 0 && (
                                <button
                                  className="flex items-center justify-center w-full h-full"
                                  onClick={(e) => renderLink(e, video)}
                                >
                                  {iconPlay}
                                </button>
                              )}
                              {video?.status === "live" && (
                                <button
                                  onClick={(e) => renderLink(e, video)}
                                  className="flex text-sm font-semibold items-center justify-center w-full h-full"
                                >
                                  <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div> LIVE
                                </button>
                              )}
                            </div>
                          </Link>
                        </div>
                      )
                    })}
                </div>
              ))
            ) : (
              <div className="text-sm p-4 h-80 text-center">{!loading && "Không có trận đấu trong ngày hôm nay"}</div>
            )}
          </div>
        </Loading>
      </div>
      {/* <ModalDownloadApp visible={visible} setVisible={setVisible} /> */}
    </main>
  )
}

LiveScore.Layout = Layout

function BoxTime({ obj }) {
  return <div className={`h-full col-span-1 flex items-center justify-center ${obj.class}`}>{obj.text}</div>
}

const iconTeamDf = (
  <svg id="Layer_1" className="h-6 w-6" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
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
const iconCupDf = (
  <svg id="Layer_1" className="h-10 w-10" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <defs></defs>
    <title>Placeholder_league-05</title>
    <rect fill="#c1c7d0" opacity="0.2" width="300" height="300" rx="150" />
    <path
      fill="#c1c7d0"
      d="M199.8,225h-5V209.77a5,5,0,0,0-5-5H110.16a5,5,0,0,0-5,5V225h-5a5,5,0,1,0,0,10h99.6a5,5,0,1,0,0-10Z"
    />
    <path
      fill="#c1c7d0"
      d="M220.06,65H79.94A15,15,0,0,0,65,79.94v7.59a54.33,54.33,0,0,0,37.16,51.55l5.29,1.76a49.59,49.59,0,0,0,27.28,21.34v7.74a5,5,0,0,1-5,5,15,15,0,0,0-15,14.94v5h70.4v-5a15,15,0,0,0-14.95-14.94,5,5,0,0,1-5-5v-7.74a49.59,49.59,0,0,0,27.28-21.34l5.29-1.76A54.33,54.33,0,0,0,235,87.53V79.94A15,15,0,0,0,220.06,65ZM84.69,115.25A44.48,44.48,0,0,1,75,87.53V79.94a5,5,0,0,1,5-5H95.4l5.08,45.62a47.88,47.88,0,0,0,1.52,7.68A44.23,44.23,0,0,1,84.69,115.25Zm88.67-7.6-8,7.63L167.22,126a5,5,0,0,1-7.18,5.29l-10-5.15-10,5.15a5,5,0,0,1-7.18-5.29l1.89-10.76-8-7.63a5,5,0,0,1,2.74-8.55l11.19-1.59,5-9.85c1.69-3.36,7.19-3.36,8.89,0l5,9.85,11.19,1.59a5,5,0,0,1,2.74,8.55ZM225,87.53a44,44,0,0,1-27,40.73,47.88,47.88,0,0,0,1.52-7.68L204.6,75h15.46a5,5,0,0,1,5,5Z"
    />
    <path
      className="cls-2"
      d="M151.71,104.33,150,100.94l-1.71,3.39a5,5,0,0,1-3.75,2.68l-3.58.51,2.51,2.39a5,5,0,0,1,1.47,4.47l-.61,3.51,3.39-1.74a5,5,0,0,1,4.56,0l3.39,1.74-.61-3.51a5,5,0,0,1,1.47-4.47l2.51-2.39-3.58-.51A5,5,0,0,1,151.71,104.33Z"
    />
  </svg>
)

const iconPlay = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27.3 16C27.3 22.2408 22.2408 27.3 16 27.3C9.75918 27.3 4.7 22.2408 4.7 16C4.7 9.75918 9.75918 4.7 16 4.7C22.2408 4.7 27.3 9.75918 27.3 16Z"
      stroke="#E6E6E6"
      strokeWidth="1.4"
    />
    <path
      d="M11.8934 11.1467V20.8534C11.8913 21.0936 11.9543 21.33 12.0756 21.5375C12.1969 21.7449 12.372 21.9157 12.5823 22.0318C12.7927 22.1479 13.0306 22.2051 13.2707 22.1971C13.5109 22.1892 13.7444 22.1165 13.9467 21.9867L21.2 17.3334C21.3815 17.2114 21.5302 17.0467 21.6331 16.8537C21.7359 16.6607 21.7897 16.4454 21.7897 16.2267C21.7897 16.008 21.7359 15.7927 21.6331 15.5997C21.5302 15.4067 21.3815 15.242 21.2 15.12L13.9867 10.0534C13.7868 9.91471 13.5529 9.83338 13.3101 9.81816C13.0673 9.80295 12.825 9.85443 12.6094 9.96704C12.3938 10.0796 12.2131 10.2491 12.0869 10.457C11.9607 10.665 11.8938 10.9035 11.8934 11.1467Z"
      fill="#E6E6E6"
    />
  </svg>
)
