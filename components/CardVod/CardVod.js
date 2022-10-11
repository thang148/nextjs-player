/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import useStore from "components/ui/Context"
import { getAccessToken } from "lib/Cookies"
import { useEffect, useRef } from "react"
import { renderTimeFromNow, renderTime, convertSeccondToTimePlay } from "utils/time"

export default function App(props) {
  const router = useRouter()
  const { togleModalLogin, userInfo, setSignKey, signKey } = useStore()
  const { status, id, type, is_live, is_protected } = props
  const isMonter = useRef(false)

  function onClick(e) {
    if (is_protected && !getAccessToken()) {
      isMonter.current = true
      togleModalLogin()
      e.preventDefault()
      return false
    }
  }

  useEffect(() => {
    if (isMonter.current && userInfo?.fullname) {
      setSignKey()
      // router.push(`/video?id=${id}&type=${type}`)
    }
  }, [userInfo])

  useEffect(() => {
    if (isMonter.current && signKey) {
      router.push(`/video?id=${id}&type=${type}`)
    }
  }, [signKey])

  if (status === "live" || !is_live) {
    return (
      <Link href={`/video?id=${id}&type=${type}`}>
        <a onClick={onClick} role="button" tabIndex="0" onKeyPress={() => {}}>
          <CardVod {...props} />
        </a>
      </Link>
    )
  } else {
    return <CardVod {...props} />
  }
}

function CardVod({ is_live, name, thumbnail, start_time, created, status, duration }) {
  const setModalLive = useStore().setModalLive

  function nextPath() {
    if (status !== "live" && is_live) {
      setModalLive({
        show: true,
        isVod: true,
        info: {
          title: name,
          start_time
        }
      })
    }
  }

  return (
    <div onClick={nextPath} role="button" tabIndex="0" onKeyPress={() => {}}>
      <div className="relative">
        <div className="relative wapper__play">
          <div className="fix_img mb-2">
            <Image className="rounded-lg bg-dark-900" src={thumbnail} width={341} height={192} alt={name} />
          </div>
          <div className="layer__play rounded-lg">
            <div className="icon__play">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.7035 0.973862C1.03778 0.550219 0.166626 1.02843 0.166626 1.81752V18.5909C0.166626 19.3799 1.03778 19.8582 1.7035 19.4345L14.8825 11.0478C15.5 10.6549 15.5 9.75348 14.8825 9.36053L1.7035 0.973862Z"
                  fill="#006DFF"
                />
              </svg>
            </div>
          </div>
          {status === "live" && is_live && (
            <div className="absolute shadow bottom-2 right-2 bg-dark-50 rounded-xl flex  items-center px-1 3xl:right-4 2xl:right-4">
              <div className=" rounded-full h-2 w-2 bg-red-500 mr-1"></div>
              <div className="text-dark-800 font-semibold" style={{ fontSize: 10 }}>
                LIVE
              </div>
            </div>
          )}
          {!is_live && (
            <div className="absolute text-white shadow text-sm bottom-1 right-1 bg-black bg-opacity-80 rounded flex space-x-2 items-center px-2 3xl:right-4 2xl:right-4">
              <div>{convertSeccondToTimePlay(duration)}</div>
            </div>
          )}
        </div>

        <div className="line-clamp-2 text-sm bottom-0 left-0 w-full text-dark-100">{name}</div>
        <time dateTime={new Date(start_time)} className="text-dark-500 text-xs">
          {is_live ? renderTime(start_time) : renderTimeFromNow(created)}
        </time>
      </div>
    </div>
  )
}
