import dynamic from "next/dynamic"
import { Navbar, Footer } from "components/common"
const ModalDownloadApp = dynamic(() => import("components/ModalDownloadApp"))

export default function Layout({ children, pageProps }) {
  return (
    <main>
      <ModalDownloadApp />
      <Navbar menus={pageProps?.menus || []} />
      <div className="m-auto container__screen flex flex-col min-h-screen">
        {/* <div className="h-16 w-full"></div> */}
        <div className="w-full flex-grow mt-16">{children}</div>
        <Footer />
      </div>
    </main>
  )
}
