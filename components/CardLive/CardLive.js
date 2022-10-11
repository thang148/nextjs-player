/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from "next/image"
import { renderTime } from "utils/time"
import Link from "next/link"
import { useRouter } from "next/router"
import useStore from "components/ui/Context"
// import { getAccessToken } from "lib/Cookies"
import { useEffect, useRef } from "react"
import { getAccessToken } from "lib/Cookies"

export default function Component(props) {
  const router = useRouter()
  const { togleModalLogin, signKey, userInfo } = useStore()
  const { status, id, type, is_protected } = props
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
    if (isMonter.current) {
      router.push(`/video?id=${id}&type=${type}`)
    }
  }, [signKey])

  useEffect(() => {
    if (isMonter.current) {
      router.push(`/video?id=${id}&type=${type}`)
    }
  }, [userInfo])

  if (status !== "live") {
    return <CardLive {...props} />
  } else {
    return (
      <Link href={`/video?id=${id}&type=${type}`}>
        <a onClick={onClick} role="button" tabIndex="0" onKeyPress={() => {}}>
          <CardLive {...props} />
        </a>
      </Link>
    )
  }
}

function CardLive({ attribute, status, location, start_time, league_name }) {
  const setModalLive = useStore().setModalLive
  const { away_logo, away_name, away_score, home_logo, home_name, home_score } = attribute

  function nextPath() {
    if (status !== "live") {
      setModalLive({
        show: true,
        isVod: false,
        info: {
          home_name,
          away_name,
          start_time
        }
      })
    }
  }

  return (
    <div onClick={nextPath} role="button" tabIndex="0" onKeyPress={() => {}}>
      <div className="bg-dark bg-opacity-50 border-dark-900 border rounded-2xl text-dark-500 relative">
        <div className="mb-4 my-2 text-sm line-clamp-1 text-center h-5 px-14 overflow-y-hidden">{league_name}</div>
        <div className="grid grid-cols-2 gap-4 relative">
          <div className="text-center col-span-1">
            <Image src={home_logo} width={48} height={48} alt={home_name} />
          </div>

          <div className="text-center absolute left-1/2 top-0 transform  -translate-x-1/2">
            <div className="text-dark-100 font-semibold text-2xl">
              {status === "live" ? (
                <>
                  {home_score} - {away_score}
                </>
              ) : (
                <>-</>
              )}
              {/* {home_score} - {away_score} */}
            </div>
          </div>
          <div className="text-center col-span-1">
            <Image src={away_logo} width={48} height={48} alt={away_name} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-dark-100 text-sm font-semibold mb-4 px-2">
          <div className="col-span-1 text-center line-clamp-1">{home_name}</div>
          <div className="col-span-1 text-center line-clamp-1">{away_name}</div>
        </div>
        <div className="flex justify-between text-xs border-dark-900 border-t px-4 py-3">
          <div>{location}</div>
          <div>{renderTime(start_time)}</div>
        </div>
        {status === "live" && (
          <div className="absolute top-2 left-2 bg-dark-50 rounded-xl flex items-center px-1">
            <div className=" rounded-full h-2 w-2 bg-red-500 mr-1"></div>
            <div className="text-dark-800 mr-1 flex items-center" style={{ fontSize: 10 }}>
              LIVE
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
