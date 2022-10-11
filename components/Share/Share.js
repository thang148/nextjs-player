/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import { FacebookProvider, ShareButton } from "react-facebook"
import { useState, useEffect } from "react"
import { Modal, notification } from "components/ui"
import { apiLiveScore } from "api"
import { useRouter } from "next/router"
import Script from "next/script"
import { TelegramShareButton, TwitterShareButton, FacebookShareButton, FacebookMessengerShareButton } from "react-share"

export default function SharePost() {
  const router = useRouter()
  const [isShow, setShow] = useState(false)
  const [linkShare, setShareLink] = useState("")

  function onCancel() {
    setShow(false)
  }

  useEffect(() => {
    async function getLink() {
      try {
        const { data } = await apiLiveScore.getLink(router?.query)
        setShareLink(data)
      } catch (error) {
        console.log(error)
      }
    }
    if (isShow && !linkShare) {
      getLink()
    }
    if (isShow) {
      setTimeout(() => {
        if (window) {
          var script = document.createElement("script")
          script.src = "https://sp.zalo.me/plugins/sdk.js"
          document.getElementsByTagName("head")[0].appendChild(script)
        }
      }, 500)
    }
  }, [isShow])

  return (
    <div>
      <button
        className="flex text-dark-500  font-semibold bg-dark-500 rounded-lg h-8 items-center px-4 hover:bg-dark-100 hover:text-dark-100"
        onClick={() => setShow(true)}
      >
        {icShare}&nbsp; Chia sẻ
      </button>

      <Modal isOpen={isShow} onCancel={onCancel}>
        <div className="px-10 py-4 text-dark-100 relative">
          <div className="mb-4 text-lg mt-4">Chia sẻ</div>
          {!linkShare && <div className="absolute inset-0 bg-black bg-opacity-50"></div>}
          <div className="">
            <div className="flex space-x-8 mb-4">
              <FacebookShareButton appId="1229685727480581" url={linkShare}>
                <div className="text-center">
                  <div className="mb-2 flex justify-center"> {icFace}</div>
                  <div>Facebook</div>
                </div>
              </FacebookShareButton>

              <FacebookMessengerShareButton appId="1229685727480581" url={linkShare}>
                <div className="text-center">
                  <div className="mb-2 flex justify-center"> {icMe}</div>
                  <div>Message</div>
                </div>
              </FacebookMessengerShareButton>

              <TelegramShareButton url={linkShare}>
                <div className="text-center">
                  <div className="mb-2 flex justify-center"> {icTele}</div>
                  <div>Telegram</div>
                </div>
              </TelegramShareButton>

              <TwitterShareButton url={linkShare}>
                <div className="text-center">
                  <div className="mb-2 flex justify-center"> {icTw}</div>
                  <div className="px-2">Twitter</div>
                </div>
              </TwitterShareButton>

              <div>
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <a
                      role="button"
                      className="zalo-share-button block cursor-pointer mx-2"
                      data-href={linkShare}
                      data-oaid="579745863508352884"
                      data-layout="1"
                      data-color="blue"
                      data-customize="true"
                    >
                      {icZalo}
                    </a>
                  </div>
                  <div>Zalo</div>
                </div>
              </div>
            </div>
            <ShareLink url={linkShare} />
            {/* {linkShare && <Script src="https://sp.zalo.me/plugins/sdk.js" />} */}
          </div>
        </div>
      </Modal>
    </div>
  )
}
const icMe = (
  <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" width="48" height="48" rx="24" fill="#E6E6E6" />
    <g clipPath="url(#clip0_1199_17131)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.5 8C15.4961 8 8.5 14.5882 8.5 23.5294C8.5 28.2039 10.4137 32.2196 13.5196 35.0118C13.7706 35.2314 13.9275 35.5765 13.9588 35.9216L14.0529 38.7765C14.0843 39.6863 15.0255 40.2824 15.8412 39.9059L19.0098 38.4941C19.2922 38.3686 19.5745 38.3686 19.8569 38.4314C21.3314 38.8392 22.8686 39.0588 24.5 39.0588C33.5039 39.0588 40.5 32.4706 40.5 23.5294C40.5 14.5882 33.5039 8 24.5 8Z"
        fill="url(#paint0_radial_1199_17131)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.8999 28.0471L19.6058 20.5804C20.3587 19.3883 21.9587 19.1059 23.0881 19.953L26.8215 22.7451C27.1666 22.9961 27.6372 22.9961 27.9823 22.7451L33.0332 18.9177C33.6921 18.4157 34.6019 19.2 34.1313 19.9216L29.4254 27.3883C28.6724 28.5804 27.0724 28.8628 25.943 28.0157L22.2097 25.2236C21.8646 24.9726 21.394 24.9726 21.0489 25.2236L15.9979 29.0824C15.3077 29.5844 14.4293 28.7687 14.8999 28.0471Z"
        fill="#E6E6E6"
      />
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_1199_17131"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(14.6503 39.8253) scale(34.8612)"
      >
        <stop stopColor="#5697FB" />
        <stop offset="0.6098" stopColor="#8936F9" />
        <stop offset="0.9348" stopColor="#DD537E" />
        <stop offset="1" stopColor="#E06F62" />
      </radialGradient>
      <clipPath id="clip0_1199_17131">
        <rect width="32" height="32" fill="white" transform="translate(8.5 8)" />
      </clipPath>
    </defs>
  </svg>
)

const icTw = (
  <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" width="48" height="48" rx="24" fill="#E6E6E6" />
    <g clipPath="url(#clip0_1199_17185)">
      <path
        d="M40.0239 14.5824C38.9106 15.0758 37.7146 15.4091 36.4573 15.5598C37.7546 14.7835 38.7252 13.5617 39.1879 12.1224C37.9691 12.8464 36.6351 13.356 35.2439 13.6291C34.3084 12.6303 33.0693 11.9682 31.719 11.7457C30.3687 11.5233 28.9827 11.7528 27.7763 12.3988C26.5698 13.0447 25.6103 14.0709 25.0468 15.318C24.4833 16.5652 24.3473 17.9634 24.6599 19.2958C22.1902 19.1718 19.7741 18.5298 17.5685 17.4117C15.3629 16.2935 13.4171 14.724 11.8573 12.8051C11.3239 13.7251 11.0173 14.7918 11.0173 15.9278C11.0167 16.9504 11.2685 17.9574 11.7504 18.8594C12.2324 19.7614 12.9295 20.5305 13.7799 21.0984C12.7936 21.0671 11.8291 20.8006 10.9666 20.3211V20.4011C10.9665 21.8354 11.4626 23.2256 12.3708 24.3358C13.279 25.4459 14.5434 26.2077 15.9493 26.4918C15.0343 26.7394 14.0751 26.7759 13.1439 26.5984C13.5406 27.8326 14.3133 28.9118 15.3538 29.685C16.3943 30.4582 17.6505 30.8867 18.9466 30.9104C16.7464 32.6377 14.0291 33.5746 11.2319 33.5704C10.7364 33.5706 10.2414 33.5416 9.74927 33.4838C12.5886 35.3093 15.8937 36.2782 19.2693 36.2744C30.6959 36.2744 36.9426 26.8104 36.9426 18.6024C36.9426 18.3358 36.9359 18.0664 36.9239 17.7998C38.139 16.9211 39.1878 15.833 40.0213 14.5864L40.0239 14.5824Z"
        fill="#23A3FF"
      />
    </g>
    <defs>
      <clipPath id="clip0_1199_17185">
        <rect width="32" height="32" fill="white" transform="translate(8.5 8)" />
      </clipPath>
    </defs>
  </svg>
)

const icTele = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="24" fill="#23A3FF" />
    <path
      d="M35.6132 12.873C35.6132 12.873 38.2032 11.863 37.9866 14.3157C37.9152 15.3257 37.2679 18.861 36.7639 22.6843L35.0372 34.011C35.0372 34.011 34.8932 35.6703 33.5979 35.959C32.3032 36.247 30.3606 34.949 30.0006 34.6603C29.7126 34.4437 24.6046 31.197 22.8059 29.6103C22.3019 29.177 21.7259 28.3117 22.8779 27.3017L30.4319 20.087C31.2952 19.2217 32.1586 17.2017 28.5612 19.6543L18.4879 26.5077C18.4879 26.5077 17.3366 27.2297 15.1786 26.5803L10.5012 25.137C10.5012 25.137 8.77455 24.055 11.7246 22.973C18.9199 19.5823 27.7699 16.1197 35.6119 12.873H35.6132Z"
      fill="#E6E6E6"
    />
  </svg>
)

const icFace = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="24" fill="#006DFF" />
    <path
      d="M25.8625 35.9962V25.0682H29.5492L30.0972 20.7896H25.8625V18.0642C25.8625 16.8296 26.2065 15.9842 27.9785 15.9842H30.2239V12.1696C29.1314 12.0525 28.0333 11.9959 26.9345 12.0002C23.6759 12.0002 21.4385 13.9896 21.4385 17.6416V20.7816H17.7759V25.0602H21.4465V35.9962H25.8625Z"
      fill="#E6E6E6"
    />
  </svg>
)
const icShare = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.6227 3.35486C12.882 3.24546 13.1816 3.30203 13.3832 3.49846L20.4885 10.4215C20.6262 10.5557 20.7027 10.7406 20.6999 10.9329C20.6972 11.1251 20.6155 11.3078 20.474 11.438L13.3687 17.9765C13.1643 18.1646 12.8679 18.214 12.6135 18.1024C12.359 17.9907 12.1947 17.7392 12.1947 17.4614V13.9654C10.0608 14.1802 8.48687 15.3563 7.39802 16.5804C6.79673 17.2564 6.3553 17.9351 6.0645 18.4451C5.91951 18.6994 5.81308 18.9098 5.74387 19.0543C5.7093 19.1265 5.68409 19.1821 5.66808 19.2183C5.66007 19.2364 5.65437 19.2496 5.65096 19.2576L5.64754 19.2657L5.64754 19.2657L5.64736 19.2661C5.52024 19.5751 5.19239 19.7513 4.86451 19.6866C4.53646 19.6219 4.29999 19.3342 4.29999 18.9998C4.29999 15.686 4.79518 12.826 6.14217 10.7786C7.42212 8.83302 9.41072 7.70915 12.1947 7.55016V3.99982C12.1947 3.71835 12.3633 3.46426 12.6227 3.35486ZM5.83885 16.268C5.99649 16.0647 6.16742 15.8574 6.35195 15.65C7.71308 14.1197 9.8621 12.5306 12.8947 12.5306C13.2813 12.5306 13.5947 12.844 13.5947 13.2306V15.8659L18.982 10.9084L13.5947 5.65921V8.23059C13.5947 8.61719 13.2813 8.93059 12.8947 8.93059C10.1272 8.93059 8.39409 9.90287 7.31175 11.548C6.53061 12.7354 6.05511 14.3225 5.83885 16.268Z"
      fill="currentColor"
    />
  </svg>
)

const icZalo = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="24" fill="#23A3FF" />
    <g clipPath="url(#clip0_1199_17130)">
      <path
        d="M11.462 27.609C12.9991 27.609 14.4445 27.5989 15.8797 27.609C16.6838 27.6192 17.1215 27.9551 17.2029 28.5964C17.2945 29.4006 16.8263 29.9401 15.9509 29.9502C14.3019 29.9706 12.6631 29.9604 11.0142 29.9604C10.5358 29.9604 10.0675 29.9808 9.58913 29.9502C8.99875 29.9197 8.41855 29.7976 8.13355 29.1868C7.84854 28.5761 8.05211 28.0264 8.43891 27.5276C10.0065 25.5325 11.5842 23.5272 13.1619 21.5321C13.2535 21.41 13.3451 21.2878 13.4367 21.1758C13.335 21.0028 13.1925 21.0842 13.0703 21.074C11.971 21.0639 10.8615 21.074 9.76217 21.0639C9.50769 21.0639 9.25322 21.0333 9.00893 20.9824C8.42873 20.8501 8.07247 20.2699 8.2048 19.6999C8.29641 19.3131 8.60177 18.9975 8.98857 18.9059C9.23287 18.8448 9.48734 18.8143 9.74181 18.8143C11.5537 18.8041 13.3757 18.8041 15.1875 18.8143C15.5132 18.8041 15.8288 18.8448 16.1443 18.9262C16.8365 19.1604 17.1317 19.8017 16.8569 20.4735C16.6126 21.0537 16.2258 21.5525 15.839 22.0512C14.5055 23.7512 13.1721 25.4409 11.8387 27.1204C11.7267 27.2528 11.6249 27.3851 11.462 27.609Z"
        fill="#E6E6E6"
      />
      <path
        d="M23.2701 22.2554C23.5143 21.9398 23.7688 21.6446 24.1862 21.5632C24.9903 21.4003 25.7435 21.9194 25.7537 22.7338C25.7842 24.7696 25.7741 26.8054 25.7537 28.8412C25.7537 29.3705 25.4076 29.8387 24.9089 29.9914C24.3999 30.1848 23.8197 30.0321 23.4838 29.5944C23.3108 29.3807 23.2395 29.34 22.9952 29.5334C22.0689 30.2866 21.0205 30.4189 19.8907 30.0525C18.0788 29.4621 17.3357 28.0472 17.1322 26.327C16.9184 24.4642 17.5393 22.8763 19.2087 21.8991C20.593 21.0746 21.9977 21.1458 23.2701 22.2554ZM19.6667 25.9707C19.6871 26.4186 19.8296 26.8461 20.0942 27.2024C20.6439 27.9352 21.6923 28.0879 22.4354 27.5383C22.5575 27.4467 22.6695 27.3347 22.7713 27.2024C23.3413 26.4288 23.3413 25.1564 22.7713 24.3828C22.4863 23.9858 22.0384 23.7517 21.56 23.7415C20.4403 23.6702 19.6565 24.5355 19.6667 25.9707ZM30.324 26.0318C30.2426 23.4158 31.9628 21.4614 34.4058 21.3901C37.0014 21.3087 38.8947 23.0493 38.9761 25.5941C39.0575 28.1694 37.4798 29.9914 35.047 30.2357C32.3904 30.5004 30.2833 28.5765 30.324 26.0318ZM32.8789 25.7875C32.8586 26.2964 33.0113 26.7952 33.3166 27.2125C33.8765 27.9454 34.9249 28.0879 35.6578 27.5179C35.7697 27.4365 35.8614 27.3347 35.953 27.2329C36.5433 26.4593 36.5433 25.1564 35.9631 24.3828C35.6781 23.996 35.2303 23.7517 34.7519 23.7415C33.6525 23.6804 32.8789 24.5151 32.8789 25.7875ZM29.4283 24.0061C29.4283 25.5839 29.4385 27.1616 29.4283 28.7394C29.4385 29.4621 28.8685 30.0627 28.1457 30.083C28.0236 30.083 27.8913 30.0728 27.7691 30.0423C27.2602 29.91 26.8734 29.3705 26.8734 28.7292V20.6369C26.8734 20.1585 26.8632 19.6902 26.8734 19.2118C26.8836 18.428 27.3823 17.9191 28.1356 17.9191C28.9092 17.9089 29.4283 18.4179 29.4283 19.2322C29.4385 20.8201 29.4283 22.4182 29.4283 24.0061Z"
        fill="#E6E6E6"
      />
    </g>
    <defs>
      <clipPath id="clip0_1199_17130">
        <rect width="32" height="32" fill="white" transform="translate(8 8)" />
      </clipPath>
    </defs>
  </svg>
)

function ShareLink({ url }) {
  function onCopy() {
    navigator.clipboard.writeText(url)
    notification.success({ message: "Copy!" })
  }

  return (
    <div role="button" id="__tolltip" className="flex justify-between">
      <div className="rounded flex-grow py-2 px-4 bg-dark-900 whitespace-nowrap overflow-x-hidden overflow-ellipsis">
        {url}
      </div>
      <button onClick={onCopy} className="text-primary-500 ml-4">
        COPY
      </button>
    </div>
  )
}
