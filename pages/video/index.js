import { useEffect, useRef, useState } from "react"
import muxjs from "mux.js"
import dynamic from "next/dynamic"
import { Layout } from "components/common"
import { api } from "apiServer"
import useStore from "components/ui/Context"
import { renderTime } from "utils/time"
import ShakaPlayer from "components/ShakaPlayer"
import BoxRelatedTo from "components/BoxRelatedTo"
import NextHead from "next/head"
const Share = dynamic(() => import("components/Share"), { ssr: false })

export default function Video({ initVideo, query }) {
  console.log({ initVideo })
  const { name, thumbnail, url, created, is_protected, start_time, content_id } = initVideo
  const { togleModalLogin, signKey, setSignKey, userInfo } = useStore()
  const [videoUrl, setVideoUrl] = useState("")
  const indexLink = useRef(0)

  const isMonter = useRef(false)
  const isMonter1 = useRef(false)
  function showModalLogin() {
    isMonter.current = true
    togleModalLogin()
  }

  // async function onError(e, data) {
  //   if (data?.details) {
  //     if (
  //       window.Hls.ErrorDetails.SIGN_KEY_EXPIRED === data.details ||
  //       window.Hls.ErrorDetails.SIGN_KEY_INVALID === data.details ||
  //       window.Hls.ErrorDetails.FRAG_PARSING_ERROR === data.details
  //     ) {
  //       if (isError.current < 3) {
  //         isError.current += 1
  //         try {
  //           setSignKey()
  //         } catch (e) {
  //           console.log(e)
  //         }
  //       }
  //     } else {
  //       if (indexLink.current < initVideo?.link_preventive?.length) {
  //         setVideoUrl(initVideo.link_preventive[indexLink.current])
  //         indexLink.current = indexLink.current + 1
  //       }
  //     }
  //   }
  // }

  useEffect(() => {
    window.muxjs = muxjs
    if (userInfo?.fullname && is_protected && !signKey) {
      setSignKey()
    }
  }, [])

  useEffect(() => {
    if (isMonter.current && userInfo?.fullname) {
      setSignKey()
    }
  }, [userInfo])

  useEffect(() => {
    if (!signKey) isMonter1.current = true
    if (isMonter1.current && signKey) {
      setVideoUrl(url)
    }
  }, [signKey])

  useEffect(() => {
    if (is_protected !== true || signKey) {
      setVideoUrl(url)
    }
    indexLink.current = 0
  }, [initVideo])

  console.log("is_protected", is_protected)
  return (
    <section className="max__width m-auto">
      <div>
        <NextHead>
          <title>{name}</title>
          <meta name="description" content={name} />
          {/* Facebook */}
          <meta property="og:title" key="title" content={name} itemProp="headline" />
          <meta property="og:description" key="description" content={name} itemProp="description" />
          <meta property="og:image" key="image" itemProp="thumbnailUrl" content={thumbnail} />
          <meta
            property="og:url"
            key="url"
            itemProp="url"
            content={`https://tv.vinasports.vn/video?id=${query.id}&type=${query.type}`}
          />
          <meta key="imageWidth" property="og:image:width" content="640" />
          <meta key="imageHeight" property="og:image:height" content="360" />
          {/* Twitter  */}
          <meta name="twitter:card" value="summary" />
          <meta name="twitter:title" key="tw-title" content={name} />
          <meta name="twitter:description" key="tw-description" content={name} />
          <meta name="twitter:image" key="tw-image" content={thumbnail} />
          <meta name="twitter:image:width" key="tw-width" content="640" />
          <meta name="twitter:image:height" key="tw-height" content="360" />
          <meta
            name="twitter:url"
            itemProp="url"
            key="tw-url"
            content={`https://tv.vinasports.vn/video?id=${query.id}&type=${query.type}`}
          />
          <meta name="twitter:site" content="@tv.vinasports" />
          <meta name="twitter:creator" content="@tv.vinasports" />
        </NextHead>
      </div>
      <div className="mb-16 pt-10 px-8">
        <div className="lg:grid grid-cols-3 xl:grid-cols-10 gap-4">
          <div className="col-span-2 xl:col-span-7 mb-4 ">
            <ShakaPlayer
              signKey={signKey}
              content_id={content_id}
              mpdFile={is_protected === true && !signKey ? "" : videoUrl}
              posterUrl={thumbnail}
              is_protected={is_protected}
            >
              {is_protected === true && !signKey && (
                <div className="absolute z-20 flex items-center justify-center inset-0 w-full h-full bg-dark-700 bg-opacity-95 filter_blur">
                  <div className="text-center ">
                    <div className="text-dark-300 mb-4">Bạn cần đăng nhập để xem nội dung này</div>
                    <button onClick={showModalLogin} className="px-8 text-lg py-2 rounded bg-primary-700 text-dark-100">
                      Đăng nhập
                    </button>
                  </div>
                </div>
              )}
              {!url && (
                <div className="absolute z-20 flex items-center justify-center inset-0 w-full h-full bg-dark-700 bg-opacity-20 filter_blur">
                  <div className="px-4 py-2 bg-primary-700 text-dark-100 rounded text-lg text-center">
                    <div className="mb-2">Video hoặc sự kiện không tồn tại mời</div>
                    <div>Mời bạn thưởng thức các nội dung hấp dẫn khác</div>
                  </div>
                </div>
              )}
            </ShakaPlayer>

            <div className="text-2xl mt-4 mb-2 text-dark-100 font-semibold">{name}</div>
            <div className="flex justify-between items-center">
              {created && (
                <div className="text-sm text-dark-500">{renderTime(new Date(start_time ? start_time : created))}</div>
              )}
              <Share />
            </div>
          </div>
          <div className="grid-cols-1 xl:col-span-3">
            <BoxRelatedTo query={query} />
          </div>
        </div>
      </div>
    </section>
  )
}

Video.Layout = Layout

export async function getServerSideProps({ query, res }) {
  let initVideo = {},
    logError = {}
  try {
    const { data } = await api.getEventOrVideo(null, { ...query, platform: "widevine" })
    initVideo = data
  } catch (error) {
    console.log(error?.response?.data || error)
    logError = error?.response?.data || error
  }

  return { props: { initVideo, query, logError } }
}
