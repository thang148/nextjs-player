/* eslint-disable jsx-a11y/media-has-caption */
import React, { memo, useEffect, useRef } from "react"
const shaka = require("shaka-player/dist/shaka-player.ui.js")

function CorePlayer({ mpdFile, posterUrl, children }) {
  const __video = useRef()
  const __videoContainer = useRef()
  const __player = useRef()

  function initPlayer() {
    __player.current = new shaka.Player(__video.current)
    __player.current.configure("streaming.forceTransmuxTS", true)
    const ui = new shaka.ui.Overlay(__player.current, __videoContainer.current, __video.current)
    // const controls = ui.getControls()
  }

  useEffect(() => {
    initPlayer()
  }, [])

  useEffect(() => {
    if (mpdFile) {
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

export default memo(CorePlayer)
