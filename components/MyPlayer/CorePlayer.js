import { useEffect, useRef, useState } from "react"
import { findDOMNode } from "react-dom"
import ReactPlayer from "react-player"
import { getVolumn } from "lib/Cookies"
import Volumn from "./Volumn"

let __time = null,
  __keyDown = false,
  seeking = false,
  isPrev = 0

const dfLoad = {
  loaded: 0,
  loadedSeconds: 0,
  played: 0,
  playedSeconds: 0
}

export default function CorePlayer({ isLive, poster, url, onError, children }) {
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [volume, setVolume] = useState(0.8)

  const [isFullScreen, setFullScreen] = useState(false)
  const [loadVideo, setLoadVideo] = useState(dfLoad)
  const [duration, setDuration] = useState(0)
  const [isEnd, setEnd] = useState(false)
  const player = useRef()
  const nextStep = useRef(0)
  const __timeNext = useRef()

  function onChangePlay() {
    if (url) setPlaying((c) => !c)
  }
  function onPause() {
    if (isLive) isPrev = true
  }

  function hoverScreen() {
    if (url) setShowControls(true)
  }
  function onMouseLeave() {
    if (!__keyDown) setShowControls(false)
  }
  function handleProgress(load) {
    let played = 0
    if (isLive) {
      if (isPrev === 0) {
        played = 1
      } else {
        played = isPrev
      }
    } else {
      played = load.played.toFixed(3)
    }
    if (!seeking) setLoadVideo({ ...load, loaded: load.loaded.toFixed(3), played })
  }
  function handleDuration(value) {
    setDuration(value)
  }
  function handleControl(e) {
    e.stopPropagation()
  }

  function onMouseDown(e) {
    e.stopPropagation()
    __keyDown = true
    seeking = true
  }

  const handlePlayTo = (e) => {
    e.stopPropagation()
    __keyDown = false
    seeking = false
    const elWapper = document.getElementById("player__wrapper").getBoundingClientRect()
    let value = (e.clientX - 16 - elWapper.x) / document.getElementById("progress").offsetWidth

    if (value < 0) value = 0.001
    if (value > 0.98) value = 0.995

    if (isLive && value !== 0.995) {
      isPrev = value
    } else {
      isPrev = 0
    }
    setLoadVideo((state) => ({ ...state, loaded: value.toFixed(3), played: value.toFixed(3) }))
    player.current.seekTo(value)
  }

  function onMouseMove(e) {
    if (__keyDown) {
      e.preventDefault()
      e.stopPropagation()
      const elWapper = document.getElementById("player__wrapper").getBoundingClientRect()
      let value = (e.clientX - 16 - elWapper.x) / document.getElementById("progress").offsetWidth
      if (value < 0) value = 0
      if (value > 1) value = 1
      setLoadVideo((state) => ({ ...state, played: value.toFixed(3) }))
    }
  }

  function onNextPrev(e, isNext) {
    e.stopPropagation()
    setPlaying(false)
    if (__timeNext.current) {
      if ((isNext && nextStep.current < 0) || (!isNext && nextStep.current > 0)) nextStep.current = 0
      if (isNext) {
        nextStep.current++
      } else {
        nextStep.current--
      }
      clearTimeout(__timeNext.current)
      setLoading(true)
    }
    __timeNext.current = setTimeout(() => {
      const value = parseFloat(loadVideo.played) + (10 * nextStep.current) / parseFloat(duration)
      nextStep.current = 0
      player.current.seekTo(parseFloat(value))
      setPlaying(true)
    }, 1000)
  }

  function onMouseMovePlayer(e) {
    if (url) {
      e.preventDefault()
      if (!showControls) setShowControls(true)
    }
  }
  function onBufferEnd() {
    setLoading(false)
  }
  function onChangeFullScreen() {
    if (document.fullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen()
      }
      // setFullScreen(false)
    } else {
      // eslint-disable-next-line react/no-find-dom-node
      const elem = findDOMNode(document.getElementById("player__wrapper"))
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen()
      }
      // setFullScreen(true)
    }
  }

  useEffect(() => {
    if (showControls && playing) {
      if (__time) {
        clearTimeout(__time)
        __time = false
      }
      __time = setTimeout(() => {
        setShowControls(false)
      }, 6000)
    }
    return () => {
      clearTimeout(__time)
    }
  }, [showControls])

  function onBuffer() {
    setLoading(true)
  }

  function goToLive() {
    isPrev = 0
    setLoadVideo((state) => ({ ...state, played: 1 }))
    player.current.seekTo(1)
  }

  function onChangeVolume(v) {
    setVolume(v)
  }

  function onReady() {
    var promise = document.querySelector("video").play()
    if (promise !== undefined) {
      promise.then(() => {
        setPlaying(true)
      })
    }
    setTimeout(() => {
      setVolume(getVolumn())
    }, 200)
  }

  function onEnded() {
    setPlaying(false)
    setEnd(true)
  }

  function onReLoad() {
    player.current.seekTo(1)
    setPlaying(true)
  }

  function onPlay() {
    setEnd(false)
  }

  function closeFullscreen() {
    if (document.fullscreen) {
      setFullScreen(true)
    } else {
      setFullScreen(false)
    }
  }

  useEffect(() => {
    const onMouseUp = (e) => {
      if (__keyDown) handlePlayTo(e)
    }
    if (player && player.current) {
      const onKeyPress = (e) => {
        switch (e.keyCode) {
          case 32:
            e.preventDefault()
            setPlaying((c) => !c)
            break
          case 39:
            if (!isLive) {
              e.preventDefault()
              document.getElementById("next").click()
            }
            break
          case 37:
            if (!isLive) {
              e.preventDefault()
              document.getElementById("prev").click()
            }
            break
          default:
            break
        }
      }

      window.addEventListener("mouseup", onMouseUp)
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("keydown", onKeyPress)
      document.addEventListener("fullscreenchange", closeFullscreen, false)
      // debugger
      return () => {
        window.removeEventListener("mouseup", onMouseUp)
        window.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("keydown", onKeyPress)
        document.removeEventListener("fullscreenchange", closeFullscreen)
      }
    }
  }, [player.current])

  useEffect(() => {
    isPrev = 0
    setLoadVideo(dfLoad)
    // setPlaying(true)
  }, [url])

  return (
    <div style={{ maxWidth: 1280, margin: "auto" }}>
      <div
        id="player__wrapper"
        className="player__wrapper"
        onMouseMove={onMouseMovePlayer}
        onClick={onChangePlay}
        onMouseOver={hoverScreen}
        onMouseLeave={onMouseLeave}
        onFocus={() => {}}
        onKeyUp={() => {}}
        role="button"
        tabIndex="0"
      >
        <div>{children}</div>
        <ReactPlayer
          onReady={onReady}
          className="react-player bg-gray-900"
          ref={player}
          playing={playing}
          onPlay={onPlay}
          url={url}
          width="100%"
          height="100%"
          onError={onError}
          onDuration={handleDuration}
          onProgress={handleProgress}
          controls={false}
          onPause={onPause}
          volume={parseFloat(volume)}
          onBuffer={onBuffer}
          onBufferEnd={onBufferEnd}
          onEnded={onEnded}
          config={{
            attributes: {
              poster
            }
          }}
        />

        {loading && url && (
          <div className="loading">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        <HoverPlay playing={playing} />
        <div
          className={`control__container ${(showControls || !playing) && "__show"}`}
          role="button"
          tabIndex="0"
          onKeyDown={handleControl}
          onClick={handleControl}
        >
          <div className="line__progress__bar">
            <div className="progress__padding" role="button" tabIndex="0" id="progress" onMouseDown={onMouseDown}>
              <div className="progress__list">
                <div className="progress__line progress" />
                <div className="progress__played progress" style={{ width: `${loadVideo.played * 100}%` }}>
                  <div className="icon__circle"></div>
                </div>
                <div className="progress__loaded progress" style={{ width: `${loadVideo.loaded * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="control__bar" id="control__bar">
            <div className="flex">
              {isEnd ? (
                <button className="__icon" onClick={onReLoad}>
                  {icReload}
                </button>
              ) : (
                <button className="__icon" onClick={onChangePlay}>
                  {playing ? icPlay : icPause}
                </button>
              )}

              {!isLive && (
                <div
                  className="__icon"
                  id="prev"
                  onClick={(e) => onNextPrev(e, false)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={() => {}}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.99991 18C4.44763 18 3.99558 18.4485 4.04155 18.9989C4.21037 21.0201 4.88942 22.9714 6.02228 24.6668C7.34086 26.6402 9.215 28.1783 11.4077 29.0866C13.6004 29.9948 16.0132 30.2324 18.341 29.7694C20.6688 29.3064 22.807 28.1635 24.4852 26.4853C26.1634 24.8071 27.3063 22.6689 27.7693 20.3411C28.2324 18.0133 27.9947 15.6005 27.0865 13.4078C26.1782 11.2151 24.6402 9.34094 22.6668 8.02236C20.6934 6.70378 18.3733 6 15.9999 6H12.3999C12.179 6 11.9999 5.82091 11.9999 5.6V1.96568C11.9999 1.60932 11.5691 1.43085 11.3171 1.68284L6.28276 6.71716C6.12655 6.87336 6.12655 7.12663 6.28276 7.28284L11.3171 12.3172C11.5691 12.5691 11.9999 12.3907 11.9999 12.0343L11.9999 8.4C11.9999 8.17908 12.179 8 12.3999 8H15.9999C17.9777 8 19.9111 8.58649 21.5556 9.6853C23.2001 10.7841 24.4818 12.3459 25.2387 14.1732C25.9956 16.0004 26.1936 18.0111 25.8078 19.9509C25.4219 21.8907 24.4695 23.6725 23.071 25.0711C21.6725 26.4696 19.8906 27.422 17.9508 27.8079C16.011 28.1937 14.0003 27.9957 12.1731 27.2388C10.3458 26.4819 8.78403 25.2002 7.68522 23.5557C6.77222 22.1893 6.21292 20.6234 6.04987 18.9984C5.99473 18.4488 5.5522 18 4.99991 18ZM19.6299 22.13C19.1881 22.1408 18.7498 22.0484 18.3499 21.86C17.9949 21.6798 17.6893 21.4154 17.4599 21.09C17.2085 20.7103 17.0319 20.286 16.9399 19.84C16.8218 19.2879 16.7648 18.7245 16.7699 18.16C16.7659 17.5955 16.8229 17.0322 16.9399 16.48C17.0338 16.0345 17.2102 15.6106 17.4599 15.23C17.6893 14.9045 17.9949 14.6402 18.3499 14.46C18.7498 14.2716 19.1881 14.1791 19.6299 14.19C20.0454 14.1584 20.462 14.2337 20.8401 14.4087C21.2182 14.5838 21.5452 14.8527 21.7899 15.19C22.3056 16.0768 22.549 17.0958 22.4899 18.12C22.549 19.1442 22.3056 20.1631 21.7899 21.05C21.5545 21.4019 21.2316 21.6866 20.8529 21.8759C20.4742 22.0653 20.0527 22.1528 19.6299 22.13ZM19.6299 20.91C19.8315 20.922 20.0324 20.8768 20.2094 20.7794C20.3863 20.6821 20.5321 20.5367 20.6299 20.36C20.8689 19.8922 20.9956 19.3752 20.9999 18.85V17.47C21.0216 16.9542 20.9222 16.4405 20.7099 15.97C20.5981 15.7987 20.4454 15.658 20.2656 15.5607C20.0857 15.4633 19.8844 15.4123 19.6799 15.4123C19.4754 15.4123 19.2741 15.4633 19.0943 15.5607C18.9144 15.658 18.7617 15.7987 18.6499 15.97C18.4376 16.4405 18.3383 16.9542 18.3599 17.47L18.3599 18.85C18.3393 19.3689 18.4385 19.8856 18.6499 20.36C18.7453 20.5343 18.8878 20.6783 19.061 20.7755C19.2343 20.8728 19.4314 20.9194 19.6299 20.91ZM10.63 20.82V22L15.78 22V20.77L14 20.77L14 14.27H12.54L10.22 15.57L10.77 16.63L12.63 15.63L12.63 20.82H10.63Z"
                      fill="#E6E6E6"
                    />
                  </svg>
                </div>
              )}
              {!isLive && (
                <div
                  className="__icon"
                  id="next"
                  onClick={(e) => onNextPrev(e, true)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={() => {}}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M27 18C26.4477 18 26.0052 18.4488 25.9501 18.9984C25.787 20.6234 25.2277 22.1893 24.3147 23.5557C23.2159 25.2002 21.6541 26.4819 19.8268 27.2388C17.9996 27.9957 15.9889 28.1937 14.0491 27.8079C12.1093 27.422 10.3275 26.4696 8.92894 25.0711C7.53041 23.6725 6.57801 21.8907 6.19215 19.9509C5.8063 18.0111 6.00433 16.0004 6.76121 14.1732C7.51809 12.3459 8.79981 10.7841 10.4443 9.6853C12.0888 8.58649 14.0222 8 16 8L19.6 8C19.8209 8 20 8.17908 20 8.4V12.0343C20 12.3907 20.4309 12.5691 20.6828 12.3172L25.7172 7.28284C25.8734 7.12663 25.8734 6.87336 25.7172 6.71716L20.6828 1.68284C20.4309 1.43085 20 1.60932 20 1.96568V5.6C20 5.82091 19.8209 6 19.6 6L16 6C13.6266 6 11.3066 6.70379 9.33316 8.02236C7.35977 9.34094 5.8217 11.2151 4.91345 13.4078C4.0052 15.6005 3.76756 18.0133 4.23058 20.3411C4.6936 22.6689 5.83649 24.8071 7.51472 26.4853C9.19296 28.1635 11.3312 29.3064 13.6589 29.7694C15.9867 30.2324 18.3995 29.9948 20.5922 29.0866C22.7849 28.1783 24.6591 26.6402 25.9776 24.6668C27.1105 22.9714 27.7896 21.0201 27.9584 18.9989C28.0043 18.4485 27.5523 18 27 18ZM19.63 22.13C19.1882 22.1408 18.7499 22.0484 18.35 21.86C17.995 21.6798 17.6894 21.4154 17.46 21.09C17.2085 20.7103 17.032 20.286 16.94 19.84C16.8219 19.2879 16.7648 18.7245 16.77 18.16C16.766 17.5955 16.823 17.0322 16.94 16.48C17.0339 16.0345 17.2102 15.6106 17.46 15.23C17.6894 14.9045 17.995 14.6402 18.35 14.46C18.7499 14.2716 19.1882 14.1791 19.63 14.19C20.0455 14.1584 20.4621 14.2337 20.8402 14.4087C21.2183 14.5838 21.5453 14.8527 21.79 15.19C22.3057 16.0768 22.5491 17.0958 22.49 18.12C22.5491 19.1442 22.3057 20.1631 21.79 21.05C21.5546 21.4019 21.2317 21.6866 20.853 21.8759C20.4743 22.0653 20.0528 22.1528 19.63 22.13ZM19.63 20.91C19.8316 20.922 20.0325 20.8768 20.2095 20.7794C20.3864 20.6821 20.5322 20.5367 20.63 20.36C20.869 19.8922 20.9957 19.3752 21 18.85V17.47C21.0216 16.9542 20.9223 16.4405 20.71 15.97C20.5982 15.7987 20.4455 15.658 20.2657 15.5607C20.0858 15.4633 19.8845 15.4123 19.68 15.4123C19.4755 15.4123 19.2742 15.4633 19.0944 15.5607C18.9145 15.658 18.7618 15.7987 18.65 15.97C18.4377 16.4405 18.3384 16.9542 18.36 17.47L18.36 18.85C18.3394 19.3689 18.4386 19.8856 18.65 20.36C18.7454 20.5343 18.8879 20.6783 19.0611 20.7755C19.2344 20.8728 19.4315 20.9194 19.63 20.91ZM10.6299 20.82V22L15.7799 22V20.77L13.9999 20.77L13.9999 14.27H12.5399L10.2199 15.57L10.7699 16.63L12.6299 15.63L12.6299 20.82H10.6299Z"
                      fill="#E6E6E6"
                    />
                  </svg>
                </div>
              )}
              <Volumn initValue={volume} onChange={onChangeVolume} />
              {isLive ? (
                <div className="__icon">
                  {isPrev !== 0 ? (
                    <button className="box_to_live" onClick={goToLive}>
                      {iconLive}
                      <span> Tới trực tiếp</span>
                    </button>
                  ) : (
                    <div className="box_live_player">
                      <div className="box_live_player">
                        <div className="circle__live"></div>
                        <div className="text_live">LIVE</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="__duration">
                  {timeConvert(duration * loadVideo.played)} / {timeConvert(duration)}
                </div>
              )}
            </div>
            <div className="flex __left">
              {isFullScreen ? (
                <button className="__full__screen" onClick={onChangeFullScreen}>
                  {icOffFullscreen}
                </button>
              ) : (
                <button className="__full__screen" onClick={onChangeFullScreen}>
                  {icFullserscreen}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function timeConvert(seconds) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad(string) {
  return ("0" + string).slice(-2)
}

function HoverPlay({ playing }) {
  const [show, setShow] = useState(false)
  const __time = useRef()
  useEffect(() => {
    if (show) {
      setShow(false)
    }
    setShow(true)
    if (__time.current) {
      clearTimeout(__time)
      __time.current = null
    }
    __time.current = setTimeout(() => {
      setShow(false)
    }, 600)
    return () => {
      clearTimeout(__time)
      __time.current = null
    }
  }, [playing])

  return (
    <div>
      {show && (
        <div className="wapper_hover">
          <div className="shape" />
          <div className={`__play_hover ${!playing ? "__pause_video" : "__play_video"}`} />
        </div>
      )}
    </div>
  )
}
const icPlay = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.51318 6.66675C9.03186 6.66675 8.57025 6.85795 8.22991 7.1983C7.88957 7.53864 7.69836 8.00024 7.69836 8.48156L7.69836 23.5186C7.69836 24.5204 8.5114 25.3334 9.51318 25.3334H13.1428C13.6241 25.3334 14.0857 25.1422 14.4261 24.8019C14.7664 24.4615 14.9576 23.9999 14.9576 23.5186L14.9576 8.48156C14.9576 8.00024 14.7664 7.53864 14.4261 7.1983C14.0857 6.85795 13.6241 6.66675 13.1428 6.66675L9.51318 6.66675Z"
      fill="#E6E6E6"
    />
    <path
      d="M18.8466 6.66675C18.3652 6.66675 17.9036 6.85795 17.5633 7.1983C17.2229 7.53864 17.0317 8.00024 17.0317 8.48156L17.0317 23.5186C17.0317 24.5204 17.8448 25.3334 18.8466 25.3334H22.4762C22.9575 25.3334 23.4191 25.1422 23.7595 24.8019C24.0998 24.4615 24.291 23.9999 24.291 23.5186L24.291 8.48156C24.291 8.24324 24.2441 8.00725 24.1529 7.78706C24.0617 7.56688 23.928 7.36682 23.7595 7.1983C23.5909 7.02977 23.3909 6.8961 23.1707 6.80489C22.9505 6.71369 22.7145 6.66675 22.4762 6.66675L18.8466 6.66675Z"
      fill="#E6E6E6"
    />
  </svg>
)

const icPause = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.1707 7.03327C10.3069 5.97882 8 7.32382 8 9.46385L8 23.0272C8 25.1672 10.3084 26.513 12.1715 25.4578L24.1424 18.6729C26.0318 17.6033 26.031 14.8814 24.1424 13.8117L12.1699 7.03327H12.1707Z"
      fill="#E6E6E6"
    />
  </svg>
)
const icFullserscreen = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.70362 8.88881C7.70362 8.57448 7.82849 8.27302 8.05076 8.05076C8.27302 7.82849 8.57448 7.70362 8.88881 7.70362H11.2592C11.5735 7.70362 11.875 7.57875 12.0972 7.35649C12.3195 7.13422 12.4444 6.83277 12.4444 6.51844C12.4444 6.20411 12.3195 5.90265 12.0972 5.68038C11.875 5.45812 11.5735 5.33325 11.2592 5.33325H8.88881C7.94582 5.33325 7.04145 5.70785 6.37465 6.37465C5.70785 7.04145 5.33325 7.94582 5.33325 8.88881V11.2592C5.33325 11.5735 5.45812 11.875 5.68038 12.0972C5.90265 12.3195 6.20411 12.4444 6.51844 12.4444C6.83277 12.4444 7.13422 12.3195 7.35649 12.0972C7.57875 11.875 7.70362 11.5735 7.70362 11.2592V8.88881Z"
      fill="#E6E6E6"
    />
    <path
      d="M7.70362 23.111C7.70362 23.4253 7.82849 23.7268 8.05076 23.949C8.27302 24.1713 8.57448 24.2962 8.88881 24.2962H11.2592C11.5735 24.2962 11.875 24.421 12.0972 24.6433C12.3195 24.8656 12.4444 25.167 12.4444 25.4813C12.4444 25.7957 12.3195 26.0971 12.0972 26.3194C11.875 26.5417 11.5735 26.6665 11.2592 26.6665H8.88881C7.94582 26.6665 7.04145 26.2919 6.37465 25.6251C5.70785 24.9583 5.33325 24.054 5.33325 23.111V20.7406C5.33325 20.4263 5.45812 20.1248 5.68038 19.9026C5.90265 19.6803 6.20411 19.5554 6.51844 19.5554C6.83277 19.5554 7.13422 19.6803 7.35649 19.9026C7.57875 20.1248 7.70362 20.4263 7.70362 20.7406V23.111Z"
      fill="#E6E6E6"
    />
    <path
      d="M23.111 7.70362C23.4253 7.70362 23.7268 7.82849 23.949 8.05076C24.1713 8.27302 24.2962 8.57448 24.2962 8.88881V11.2592C24.2962 11.5735 24.421 11.875 24.6433 12.0972C24.8656 12.3195 25.167 12.4444 25.4813 12.4444C25.7957 12.4444 26.0971 12.3195 26.3194 12.0972C26.5417 11.875 26.6665 11.5735 26.6665 11.2592V8.88881C26.6665 7.94582 26.2919 7.04145 25.6251 6.37465C24.9583 5.70785 24.054 5.33325 23.111 5.33325H20.7406C20.4263 5.33325 20.1248 5.45812 19.9026 5.68038C19.6803 5.90265 19.5554 6.20411 19.5554 6.51844C19.5554 6.83277 19.6803 7.13422 19.9026 7.35649C20.1248 7.57875 20.4263 7.70362 20.7406 7.70362H23.111Z"
      fill="#E6E6E6"
    />
    <path
      d="M24.2962 23.111C24.2962 23.4253 24.1713 23.7268 23.949 23.949C23.7268 24.1713 23.4253 24.2962 23.111 24.2962H20.7406C20.4263 24.2962 20.1248 24.421 19.9026 24.6433C19.6803 24.8656 19.5554 25.167 19.5554 25.4813C19.5554 25.7957 19.6803 26.0971 19.9026 26.3194C20.1248 26.5417 20.4263 26.6665 20.7406 26.6665H23.111C24.054 26.6665 24.9583 26.2919 25.6251 25.6251C26.2919 24.9583 26.6665 24.054 26.6665 23.111V20.7406C26.6665 20.4263 26.5417 20.1248 26.3194 19.9026C26.0971 19.6803 25.7957 19.5554 25.4813 19.5554C25.167 19.5554 24.8656 19.6803 24.6433 19.9026C24.421 20.1248 24.2962 20.4263 24.2962 20.7406V23.111Z"
      fill="#E6E6E6"
    />
  </svg>
)

const icOffFullscreen = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 5.33333C12 4.97971 11.8595 4.64057 11.6095 4.39052C11.3594 4.14048 11.0203 4 10.6667 4C10.313 4 9.97391 4.14048 9.72386 4.39052C9.47381 4.64057 9.33333 4.97971 9.33333 5.33333V8.66667C9.33333 8.84348 9.2631 9.01305 9.13807 9.13807C9.01305 9.2631 8.84348 9.33333 8.66667 9.33333H5.33333C4.97971 9.33333 4.64057 9.47381 4.39052 9.72386C4.14048 9.97391 4 10.313 4 10.6667C4 11.0203 4.14048 11.3594 4.39052 11.6095C4.64057 11.8595 4.97971 12 5.33333 12H8.66667C9.55072 12 10.3986 11.6488 11.0237 11.0237C11.6488 10.3986 12 9.55072 12 8.66667V5.33333Z"
      fill="#E6E6E6"
    />
    <path
      d="M12 26.6667C12 27.0203 11.8595 27.3594 11.6095 27.6095C11.3594 27.8595 11.0203 28 10.6667 28C10.313 28 9.97391 27.8595 9.72386 27.6095C9.47381 27.3594 9.33333 27.0203 9.33333 26.6667V23.3333C9.33333 23.1565 9.2631 22.987 9.13807 22.8619C9.01305 22.7369 8.84348 22.6667 8.66667 22.6667H5.33333C4.97971 22.6667 4.64057 22.5262 4.39052 22.2761C4.14048 22.0261 4 21.687 4 21.3333C4 20.9797 4.14048 20.6406 4.39052 20.3905C4.64057 20.1405 4.97971 20 5.33333 20H8.66667C9.55072 20 10.3986 20.3512 11.0237 20.9763C11.6488 21.6014 12 22.4493 12 23.3333V26.6667Z"
      fill="#E6E6E6"
    />
    <path
      d="M21.3333 4C20.9797 4 20.6406 4.14048 20.3905 4.39052C20.1405 4.64057 20 4.97971 20 5.33333V8.66667C20 9.55072 20.3512 10.3986 20.9763 11.0237C21.6014 11.6488 22.4493 12 23.3333 12H26.6667C27.0203 12 27.3594 11.8595 27.6095 11.6095C27.8595 11.3594 28 11.0203 28 10.6667C28 10.313 27.8595 9.97391 27.6095 9.72386C27.3594 9.47381 27.0203 9.33333 26.6667 9.33333H23.3333C23.1565 9.33333 22.987 9.2631 22.8619 9.13807C22.7369 9.01305 22.6667 8.84348 22.6667 8.66667V5.33333C22.6667 4.97971 22.5262 4.64057 22.2761 4.39052C22.0261 4.14048 21.687 4 21.3333 4Z"
      fill="#E6E6E6"
    />
    <path
      d="M20 26.6667C20 27.0203 20.1405 27.3594 20.3905 27.6095C20.6406 27.8595 20.9797 28 21.3333 28C21.687 28 22.0261 27.8595 22.2761 27.6095C22.5262 27.3594 22.6667 27.0203 22.6667 26.6667V23.3333C22.6667 23.1565 22.7369 22.987 22.8619 22.8619C22.987 22.7369 23.1565 22.6667 23.3333 22.6667H26.6667C27.0203 22.6667 27.3594 22.5262 27.6095 22.2761C27.8595 22.0261 28 21.687 28 21.3333C28 20.9797 27.8595 20.6406 27.6095 20.3905C27.3594 20.1405 27.0203 20 26.6667 20H23.3333C22.4493 20 21.6014 20.3512 20.9763 20.9763C20.3512 21.6014 20 22.4493 20 23.3333V26.6667Z"
      fill="#E6E6E6"
    />
  </svg>
)

const iconLive = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="14.6667" width="20" height="9.33333" rx="1" fill="#E6E6E6" />
    <path d="M12 21.3333H14.6588V20.7258H12.7749V17.3333H12V21.3333Z" fill="black" />
    <path d="M16.1062 17.3333H15.3313V21.3333H16.1062V17.3333Z" fill="black" />
    <path
      d="M17.5175 17.3333H16.6675L18.1734 21.3333H19.1299L20.6379 17.3333H19.7857L18.6746 20.4817H18.6308L17.5175 17.3333Z"
      fill="black"
    />
    <path
      d="M21.2013 21.3333H24V20.7258H21.9762V19.634H23.8392V19.0266L21.9762 19.0266V17.9407L23.9833 17.9407V17.3333L21.2013 17.3333V21.3333Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.4714 8.19526L28 10.6667C28.2603 10.927 28.2603 11.3491 28 11.6095L24.4714 13.8047C24.2111 14.0651 23.7889 14.0651 23.5286 13.8047C23.2682 13.5444 23.2682 13.1223 23.5286 12.8619L25.9191 11.8047L10 11.8047C7.42267 11.8047 5.33333 13.8941 5.33333 16.4714V18.4714C5.33333 18.8396 5.03486 19.138 4.66667 19.138C4.29848 19.138 4 18.8396 4 18.4714V16.4714C4 13.1577 6.68629 10.4714 10 10.4714L25.9191 10.4714L23.5286 9.13807C23.2682 8.87772 23.2682 8.45561 23.5286 8.19526C23.7889 7.93491 24.2111 7.93491 24.4714 8.19526Z"
      fill="#E6E6E6"
    />
  </svg>
)

const icReload = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.33337 6.6665C5.33337 6.31288 5.47385 5.97374 5.7239 5.72369C5.97395 5.47364 6.31309 5.33317 6.66671 5.33317C7.02033 5.33317 7.35947 5.47364 7.60952 5.72369C7.85956 5.97374 8.00004 6.31288 8.00004 6.6665V8.94384C9.6101 7.11844 11.796 5.89859 14.1949 5.48679C16.5938 5.075 19.0614 5.49602 21.1881 6.67997C23.3147 7.86392 24.9725 9.73959 25.8862 11.9956C26.7999 14.2516 26.9145 16.7522 26.2111 19.0824C25.5077 21.4125 24.0285 23.432 22.0191 24.8056C20.0097 26.1791 17.591 26.8242 15.1645 26.6336C12.7379 26.4431 10.4496 25.4283 8.67923 23.7579C6.9089 22.0875 5.7631 19.8619 5.43204 17.4505C5.32537 16.6558 5.98404 15.9998 6.78671 15.9998C7.45604 15.9998 7.98937 16.5465 8.09071 17.2078C8.36494 19.0049 9.24307 20.6551 10.5805 21.8864C11.9178 23.1177 13.6347 23.8569 15.4483 23.982C17.2619 24.1072 19.0641 23.611 20.5579 22.575C22.0518 21.5391 23.1483 20.0253 23.6668 18.2829C24.1854 16.5405 24.095 14.6735 23.4106 12.9893C22.7262 11.3051 21.4886 9.90427 19.9017 9.01746C18.3148 8.13065 16.4731 7.81078 14.6801 8.11052C12.8871 8.41027 11.2496 9.31175 10.0374 10.6665H12C12.3537 10.6665 12.6928 10.807 12.9428 11.057C13.1929 11.3071 13.3334 11.6462 13.3334 11.9998C13.3334 12.3535 13.1929 12.6926 12.9428 12.9426C12.6928 13.1927 12.3537 13.3332 12 13.3332L6.66671 13.3332C6.31309 13.3332 5.97395 13.1927 5.7239 12.9426C5.47385 12.6926 5.33337 12.3535 5.33337 11.9998L5.33337 6.6665Z"
      fill="#E6E6E6"
    />
  </svg>
)
