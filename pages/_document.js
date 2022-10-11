import Document, { Html, Head, Main, NextScript } from "next/document"
import KEY from "utils/Const"
class MyDocument extends Document {
  render() {
    return (
      <Html lang="vi">
        <Head>
          <meta name="description" content="VinaSports - Xem trực tiếp bóng đá, thể thao, tin tức số 1 Việt Nam" />
          <link rel="icon" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.svg" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="tv.onsport.vn" />
          <meta property="fb:app_id" content={KEY.KEY_FACEBOOK} />
          <meta content="news" itemProp="genre" name="medium" />
          <meta content="vi-VN" itemProp="inLanguage" />
          <meta content="" itemProp="articleSection" />
          <meta content="Tin nhanh VinaSports" itemProp="sourceOrganization" name="source" />
          <meta name="copyright" content="VinaSports" />
          <meta name="author" content="VinaSports" />
          <meta name="robots" content="index, follow" />
          <meta name="geo.placename" content="Ha Noi, Viet Nam" />
          <meta name="geo.region" content="VN-HN" />
          <meta name="geo.position" content="21.030624;105.782431" />
          <meta name="ICBM" content="21.030624, 105.782431" />
          <meta name="revisit-after" content="days" />
          <link rel="manifest" href="/site.webmanifest" key="site-manifest" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}

          <script defer src="https://www.googletagmanager.com/gtag/js?id=G-FW79655T2H" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-FW79655T2H', {
                page_path: window.location.pathname,
                });
              `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
