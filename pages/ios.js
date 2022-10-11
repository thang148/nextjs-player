import { useEffect } from "react"
import NextHead from "next/head"

export default function Component() {
  useEffect(() => {
    if (window && document.getElementById("id_link")) {
      document.getElementById("id_link").click()
    }
  }, [])

  return (
    <div>
      <NextHead>
        {/* Facebook */}
        <meta key="title" content="Vina Sports" itemProp="headline" property="og:title" />
        <meta
          key="description"
          content="Ứng dụng xem live bóng đá hàng đầu Việt Nam"
          itemProp="description"
          property="og:description"
        />
        <meta property="og:url" key="url" itemProp="url" content={`https://onsport.vn/android`} />
        <meta
          property="og:image"
          key="image"
          itemProp="thumbnailUrl"
          content="https://onnews-homepage.vtvcab.gotekvn.com/banner_mobile.png"
        />
        <meta key="imageWidth" property="og:image:width" content="680" />
        <meta key="imageHeight" property="og:image:height" content="354" />
      </NextHead>
      <a href="https://play.google.com/store/apps/details?id=com.vtvcab.vinasports" id="id_link">
        IOS
      </a>
    </div>
  )
}
