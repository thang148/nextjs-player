import "assets/main.css"
import "assets/base.scss"
import "assets/player.scss"

import { Head } from "components/common"
import { StoreProvider } from "components/ui/Context"
import ModalLogin from "components/ModalLogin"
import NextNprogress from "nextjs-progressbar"

const Noop = ({ children }) => <>{children}</>

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || Noop

  return (
    <>
      <NextNprogress
        color="#52b5f9"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ easing: "ease", speed: 500, showSpinner: false }}
      />
      <Head />
      <StoreProvider>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
        <ModalLogin />
        <div id="fb-root"></div>
        <div id="modal-root"></div>
        <div id="toast-root"></div>
      </StoreProvider>
    </>
  )
}

export default MyApp
