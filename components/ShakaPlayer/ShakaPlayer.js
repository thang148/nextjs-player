import dynamic from "next/dynamic"
import { memo } from "react"
import "shaka-player/dist/controls.css" /* Shaka player CSS import */
const CorePlayer = dynamic(() => import("./CorePlayer"), { ssr: false })
const CorePlayerDrm = dynamic(() => import("./CorePlayerDrm"), { ssr: false })

function ShakaPlayer(props) {
  return <div>{props?.is_protected === true ? <CorePlayerDrm {...props} /> : <CorePlayer {...props} />}</div>
}

export default memo(ShakaPlayer)
