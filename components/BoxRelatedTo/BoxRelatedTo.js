/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
// import useStore from "components/ui/Context"
import { renderTime, convertSeccondToTimePlay, renderTimeFromNow } from "utils/time"
// import { Modal } from "components/ui"
import Link from "next/link"
import axios from "axios"
// import { useRouter } from "next/router"
let calling = false

export default function BoxRelatedTo({ query }) {
  // const router = useRouter()
  // const { togleModalLogin } = useStore()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  // const [isOpen, setOpen] = useState(false)
  const pageNum = useRef(0)
  const maxCount = useRef(50)
  const wapper = useRef()
  // const __link = useRef()

  // function onCancel() {
  //   setOpen(false)
  // }

  // function onShowModalLogin() {
  //   togleModalLogin()
  //   setOpen(false)
  // }

  async function fetch(list) {
    try {
      pageNum.current = pageNum.current + 1
      const res = await axios.get("/api/related-to", {
        params: {
          ...query,
          page_num: pageNum.current,
          page_size: 10
        }
      })
      const { data, count } = res.data
      maxCount.current = count
      setRows([...list, ...data])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      calling = false
    }
  }

  useEffect(() => {
    function onScroll(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.target
      if (scrollTop + 350 > scrollHeight - offsetHeight) {
        if (!calling) {
          setLoading(true)
        }
      }
    }
    if (wapper.current) {
      wapper.current.addEventListener("scroll", onScroll)
      return () => {
        if (wapper.current) wapper.current.removeEventListener("scroll", onScroll)
      }
    }
  }, [])

  // function onClick(e, is_protected, link) {
  //   if (is_protected && !signKey) {
  //     setOpen(true)
  //     __link.current = link
  //     e.preventDefault()
  //     return
  //   } else {
  //     __link.current = ""
  //   }
  // }

  useEffect(() => {
    if (loading && maxCount.current > rows.length) fetch(rows)
  }, [loading])

  useEffect(() => {
    pageNum.current = 0
    fetch([])
  }, [query])

  // useEffect(() => {
  //   if (__link.current) {
  //     router.push(__link.current)
  //   }
  // }, [userInfo])

  return (
    <div className="bg-dark rounded">
      <div className="text-dark-100 px-4 py-3 border-b border-gray-700 text-lg font-semibold">Video liên quan</div>
      <div className="p-4 overflow-y-auto scroll__video" ref={wapper}>
        {rows.length > 0 ? (
          rows?.map(
            ({ thumbnail, type, name, id, created, is_live, duration, status, is_protected, start_time }, k) => {
              const _link = `/video?id=${id}&type=${type}`
              return (
                <div className="mb-2" key={k}>
                  <Link href={_link}>
                    <a
                      // onClick={(e) => onClick(e, is_protected, _link)}
                      role="button"
                      tabIndex="0"
                      onKeyPress={() => {}}
                    >
                      <div className="flex">
                        <div className="mr-3 relative">
                          <div className="fix_img shadow-sm" style={{ minWidth: 143 }}>
                            <Image height={81} width={143} className="rounded-sm" src={thumbnail} />
                          </div>
                          {status === "live" && is_live && (
                            <div className="absolute shadow bottom-2 right-2 bg-dark-50 rounded-xl flex  items-center px-1">
                              <div className=" rounded-full h-2 w-2 bg-red-500 mr-1"></div>
                              <div className="text-dark-800 font-semibold" style={{ fontSize: 10 }}>
                                LIVE
                              </div>
                            </div>
                          )}
                          {!is_live && (
                            <div className="absolute text-white shadow text-xs bottom-1 right-1 bg-black bg-opacity-80 rounded flex space-x-2 items-center px-1">
                              <div>{convertSeccondToTimePlay(duration)}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex-grow text-dark-300 text-sm">
                          <div className="text-dark-100 font-medium mb-1 line-clamp-3">{name}</div>
                          <div className="text-dark-500 text-xs">
                            <time dateTime={new Date(start_time)} className="text-dark-500 text-xs">
                              {is_live ? renderTime(start_time) : renderTimeFromNow(created)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              )
            }
          )
        ) : (
          <div></div>
        )}
      </div>
      {/* <Modal isOpen={isOpen} onCancel={onCancel}>
        <div className="p-6 text-center">
          <div className="py-4">Bạn cần đăng nhập để xem nội dung này</div>
          <button onClick={onShowModalLogin} className="bg-primary-700 py-2 px-4 rounded text-dark-100">
            Đăng nhập
          </button>
        </div>
      </Modal> */}
    </div>
  )
}
