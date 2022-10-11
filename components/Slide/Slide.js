/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import cn from "classnames"
import { getAccessToken } from "lib/Cookies"
import useStore from "components/ui/Context"
import { renderTime } from "utils/time"
import { useRouter } from "next/router"
import { useMemo } from "react"

function PlayerHome({ slides }) {
  const count = slides.length
  const router = useRouter()
  const __time = useRef()
  const { togleModalLogin, signKey, setModalLive } = useStore()

  const [step, setStep] = useState(0)
  const isMonter = useRef(false)
  const __count = useRef(0)

  function onNext() {
    if (step < count - 1) {
      setStep((c) => c + 1)
      __count.current = step + 1
    }
  }

  function onPrev() {
    if (step > 0) setStep((c) => c - 1)
    __count.current = step - 1
  }

  function onClick(item, e) {
    if (item?.type_link === 1 && item?.event) {
      if (item?.event?.status === "live") return true
      setModalLive({
        show: true,
        isVod: true,
        info: {
          title: item?.event?.name,
          start_time: item?.event?.start_time
        }
      })
      e.preventDefault()
      return false
    }
    if (item?.type_link !== 0 && !getAccessToken()) {
      if (item?.event?.is_protected || item?.video?.is_protected) {
        isMonter.current = true
        togleModalLogin()
        e.preventDefault()
        return false
      }
    }

    if (!item?.event && !item?.video) {
      e.preventDefault()
      return false
    }
  }

  // function isPlay() {
  //   const itemabc = slides[step]
  //   console.log(itemabc)
  //   // const { type_link, event } = itemabc
  //   if (itemabc?.type_link === 1 && (!itemabc.event || itemabc.event?.status === "finish")) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }
  const isPlay = useMemo(() => {
    const itemabc = slides[step]
    // const { type_link, event } = itemabc
    if (itemabc?.type_link === 1 && (!itemabc.event || itemabc.event?.status === "finish")) {
      return false
    } else {
      return true
    }
  }, [step])

  function onNextPath() {
    clearInterval(__time.current)
    __time.current = null
    if (isPlay) {
      const item = slides[step]
      if (item?.type_link === 1 && item?.event) {
        if (item?.event?.status === "live") {
          router.push(convertLink(slides[step]))
          return true
        }
        setModalLive({
          show: true,
          isVod: true,
          info: {
            title: item?.event?.name,
            start_time: item?.event?.start_time
          }
        })
        return false
      }
      if (item?.type_link !== 0 && !getAccessToken()) {
        if (item?.event?.is_protected || item?.video?.is_protected) {
          isMonter.current = true
          togleModalLogin()
          return false
        }
      }
      if (!item?.event && !item?.video) {
        // router.push(convertLink(slides[step]))
        window.open(convertLink(slides[step]))
        return false
      }
    }
    router.push(convertLink(slides[step]))
  }

  useEffect(() => {
    if (isMonter.current) {
      router.push(convertLink(slides[step]))
    }
  }, [signKey])

  useEffect(() => {
    __time.current = setInterval(() => {
      if (__count.current === count) __count.current = 0
      setStep(__count.current)
      __count.current = __count.current + 1
    }, 7000)
    return () => {
      clearInterval(__time.current)
    }
  }, [])

  return (
    <div className="grid grid-cols-3 3xl:grid-cols-5 relative z-0 mb-10 p-10 2xl:p-12 bg_title ">
      <div className="col-span-1 3xl:col-span-2 flex items-center">
        <div>
          <button
            onClick={onNextPath}
            className="font-bold text-left text-dark-100 mb-6 text-2xl lg:text-3xl leading-title pr-4"
          >
            {slides[step]?.name}
          </button>
          {slides[step]?.type_link === 1 && slides[step]?.event?.start_time && (
            <div className="mb-6">
              <time className="text-kg text-dark-500" dateTime={slides[step]?.event?.start_time}>
                {renderTime(slides[step]?.event?.start_time, true)}
              </time>
            </div>
          )}
          {isPlay && (
            <div>
              <button
                onClick={onNextPath}
                className="py-2 w-40 text-medium text-center text-dark bg-primary-500 rounded-full hover:bg-primary-hover font-semibold"
              >
                XEM NGAY
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-2 3xl:col-span-3 relative">
        <div className="absolute -right-4 top-1/2 z-20 transform -translate-y-1/2">
          <button
            className={cn(
              "bg-dark-600 border-2 rounded-full bg-opacity-90 p-1 text-dark-100 mr-4",
              step > 0 ? "border-gray-100 text-dark-100" : "border-dark-900 text-dark-900"
            )}
            onClick={onPrev}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
          </button>

          <button
            className={cn(
              "bg-dark-600 border-2 rounded-full bg-opacity-90 p-1 text-dark-100",
              step < count - 1 ? "border-gray-100 text-dark-100" : "border-dark-900 text-dark-900"
            )}
            onClick={onNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={28}
              height={28}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        <div className="overflow-x-hidden rounded-lg">
          <div className="flex wapper__slide rounder-lg" style={{ transform: `translateX(-${step * 100}%)` }}>
            {count > 0 &&
              slides.map((item) => {
                const { type_link, id, event } = item
                return (
                  <div key={id} className="w-full flex-shrink-0">
                    {type_link === 0 ? (
                      <a href={convertLink(item)} target="__blank">
                        <MyImage {...item} />
                      </a>
                    ) : (
                      <>
                        {event?.status === "live" || type_link === 2 ? (
                          <Link href={convertLink(item)}>
                            <a role="button" tabIndex="0" onKeyPress={() => {}}>
                              <MyImage {...item} />
                            </a>
                          </Link>
                        ) : (
                          <div onClick={(e) => onClick(item, e)} role="button" tabIndex="0" onKeyPress={() => {}}>
                            <MyImage {...item} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default PlayerHome

function renderUrl(base_url, thumbnail, size) {
  if (thumbnail.includes("http")) return thumbnail
  return `${base_url}${size}/${thumbnail}`
}

function MyImage({ base_url, thumbnail, name, type_link, event }) {
  return (
    <div className="relative">
      {type_link === 1 && (
        <div>
          {event?.status === "live" && (
            <div className="absolute z-20 shadow bottom-4 right-4 h-7 bg-dark-50 rounded-full flex items-center px-3">
              <div className=" rounded-full h-2 w-2 bg-red-500 mr-2"></div>
              <div className="text-dark-800 font-semibold text-sm">LIVE</div>
            </div>
          )}

          {event?.status === "not_started" && (
            <div className="absolute z-20 shadow bottom-4 right-4 h-7 bg-dark-50 rounded-full flex items-center px-3">
              <div className="text-dark-800 font-semibold text-sm">UPCOMING</div>
            </div>
          )}
          {event?.status === "fisnish" && (
            <div className="absolute z-20 shadow bottom-4 right-4 bg-dark-50 rounded-full flex h-7 items-center px-3">
              <div className="text-dark-800 font-semibold text-sm">Fisnish</div>
            </div>
          )}
        </div>
      )}
      {type_link === 2 && (
        <div className="absolute z-20 shadow bottom-4 left-4 bg-dark-50 rounded-full flex h-7 items-center px-3">
          <div className="text-dark-800 font-semibold text-sm">Video</div>
        </div>
      )}
      <div className="fix_img rounded-lg">
        <Image
          blurDataURL={renderUrl(base_url, thumbnail, "160x90")}
          placeholder="blur"
          className="z-0 rounded-lg"
          src={renderUrl(base_url, thumbnail, "720x405")}
          height={720}
          width={1280}
          alt={name}
        />
      </div>
    </div>
  )
}
function convertLink(item) {
  const { type_link, link, event, video } = item
  if (type_link === 1) {
    return `/video?id=${event?.id}&type=1`
  }
  if (type_link === 2) {
    return `/video?id=${video?.id}&type=2`
  }
  return link
}
