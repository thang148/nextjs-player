/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useState, useRef, useEffect } from "react"
import CardLive from "components/CardLive"
import CardVod from "components/CardVod"
import Link from "next/link"

// eslint-disable-next-line react/display-name
const MySwiper = memo(({ name, events, isLive, id }) => {
  const [step, setStep] = useState(0)
  const [widthItem, setWidthItem] = useState(isLive ? 348 : 250)
  const [slidesPerView, setSlidesPerView] = useState(isLive ? 5 : 6)
  const __time = useRef()
  const __slider = useRef()
  const widthNext = useRef(1280)
  function onNext() {
    setStep((c) => c + 1)
  }

  function onPrev() {
    setStep(step > 0 ? step - 1 : 0)
  }

  function onChange() {
    let __slidesPerView = 4
    if (isLive) {
      __slidesPerView = 2
      if (window.innerWidth > 960) {
        __slidesPerView = 3
      }
      if (window.innerWidth > 1024) {
        __slidesPerView = 3
      }
      if (window.innerWidth > 1280) {
        __slidesPerView = 4
      }
      if (window.innerWidth > 1800) {
        __slidesPerView = 5
      }
    } else {
      __slidesPerView = 2
      if (window.innerWidth > 720) {
        __slidesPerView = 3
      }
      if (window.innerWidth > 1024) {
        __slidesPerView = 4
      }
      if (window.innerWidth > 1280) {
        __slidesPerView = 5
      }
      if (window.innerWidth > 1520) {
        __slidesPerView = 6
      }
    }
    const maxWindow = window.innerWidth > 1920 ? 1920 : window.innerWidth
    const __w = (maxWindow - 96 - __slidesPerView * 16) / __slidesPerView
    widthNext.current = (__w + 16) * __slidesPerView
    setSlidesPerView(__slidesPerView)
    setWidthItem(__w)
  }

  function getTranslateX() {
    // debugger
    // console.log("events.length", events.length)
    // console.log(" widthNext.current", widthNext.current)
    if (step > 0 && __slider.current && (step + 1) * slidesPerView >= events.length) {
      return (widthNext.current / slidesPerView) * (events.length - slidesPerView) * -1
    } else {
      return step * widthNext.current * -1
    }
  }

  useEffect(() => {
    const onChangeSize = () => {
      if (__time.current) {
        clearTimeout(__time.current)
        __time.current = null
      }
      __time.current = setTimeout(() => {
        onChange()
      }, 300)
    }
    if (__slider.current) {
      onChange()
      window.addEventListener("resize", onChangeSize)
    }

    return () => {
      window.removeEventListener("resize", onChangeSize)
    }
  }, [])

  return (
    <div className="mb-4 md:mb-4 lg:mb-6">
      <h2 className="relative mb-2 md:mb-2 text-sm md:text-lg lg:text-xl font-semibold ">
        <Link href={`/danh-muc/${id}`}>
          <a className="text-dark-100 flex items-center wapper_see_more">
            <span className="uppercase mr-4">{name}</span>{" "}
            <div className="text-primary-500 text-sm flex items-center see_more">
              <span>Xem thêm</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 17L18 12L13 7"
                  stroke="#66A7FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 17L11 12L6 7"
                  stroke="#66A7FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        </Link>
      </h2>
      <div className="relative wapper__swiper__custom">
        {step !== 0 && (
          <button onClick={onPrev} className="prev__swiper__custom action__swiper__custom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={__slider}
          className="swiper__custom space-x-4"
          style={{ transform: `translateX(${getTranslateX()}px)` }}
        >
          {events?.length > 0 &&
            events?.map((item) => {
              const { id } = item
              return (
                <div className="slide__custom" style={{ width: widthItem + "px" }} key={id}>
                  {isLive ? <CardLive {...item} /> : <CardVod {...item} />}
                </div>
              )
            })}
        </div>

        {(step + 1) * slidesPerView < events?.length && (
          <button onClick={onNext} className="next__swiper__custom action__swiper__custom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
})

export default MySwiper
