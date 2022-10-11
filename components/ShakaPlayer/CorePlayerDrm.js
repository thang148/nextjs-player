/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from "react"
const shaka = require("shaka-player/dist/shaka-player.ui.js")
const licenseServer = "https://vtvcab.stg.ondrm.cloud/license-api/v1/drm/licenses/widevine"

function CorePlayer({ mpdFile, signKey, posterUrl, content_id, children }) {
  const __video = useRef()
  const __videoContainer = useRef()
  const __player = useRef()
  const __isConfigDrm = useRef(false)

  function configDrm() {
    __player.current.configure({
      drm: {
        servers: { "com.widevine.alpha": licenseServer }
      }
    })
    __player.current.getNetworkingEngine().registerRequestFilter((type, request) => {
      if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
        request.uris[0] += `?content_id=${content_id}`
        request.headers["Token"] = signKey
      }
    })
    __player.current.getNetworkingEngine().registerResponseFilter(function (type, response) {
      const StringUtils = shaka.util.StringUtils
      const Uint8ArrayUtils = shaka.util.Uint8ArrayUtils
      if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
        const wrappedString = StringUtils.fromUTF8(response.data)
        const wrapped = JSON.parse(wrappedString)
        const rawLicenseBase64 = wrapped.data
        response.data = Uint8ArrayUtils.fromBase64(rawLicenseBase64)
      }
    })
  }

  function initPlayer() {
    __player.current = new shaka.Player(__video.current)
    const ui = new shaka.ui.Overlay(__player.current, __videoContainer.current, __video.current)
    // if (mpdFile && signKey) configDrm()
    // const controls = ui.getControls()
  }

  useEffect(() => {
    initPlayer()
    return () => {
      __player.current.destroy()
    }
  }, [])

  useEffect(() => {
    if (mpdFile) {
      if (!__isConfigDrm.current) {
        configDrm()
        __isConfigDrm.current = true
      }
      __player.current
        .load(mpdFile)
        .then(function () {
          console.log("The video has now been loaded!")
        })
        .catch((e) => console.log(e)) // onError is executed if the asynchronous load fails.
    }
  }, [mpdFile])

  return (
    <div ref={__videoContainer}>
      <div>{children}</div>
      <video autoPlay id="video" ref={__video} className="w-full h-full rounded" poster={posterUrl}></video>
    </div>
  )
}

export default CorePlayer
