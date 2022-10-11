import QR from "qrcode.react"
import { useEffect, useRef, useState } from "react"
import { apiUser } from "api"
import { uuid } from "uuidv4"
import { notification } from "components/ui"
import mqtt from "mqtt"

let __count = 60

export default function QRCode({ onChangeView, onLogin }) {
  const [code, setCode] = useState("")
  const [count, setCount] = useState(__count)
  const device_id = useRef()
  const __time = useRef()

  function init() {
    const options = {
      clean: false,
      keepalive: 1800,
      protocolVersion: 5,
      reconnectPeriod: 1000,
      connectTimeout: 30000,
      clientId: `web_smarttv_${device_id.current}`
    }
    const url = process.env.NEXT_PUBLIC_SOCKET
    const client = mqtt.connect(url, options)
    const toppic = `login_smarttv/${device_id.current}`
    client.on("connect", function () {
      client.subscribe(toppic, function (err) {
        if (err) {
          console.log("Error")
        }
      })
    })
    client.on("message", (toppic, payload) => {
      onLogin(JSON.parse(payload.toString()))
      notification.success({ message: "Đăng nhập thành công!" })
      client.unsubscribe(toppic)
      client.end(true)
    })
  }

  async function getCode() {
    if (__time.current) clearInterval(__time.current)
    try {
      const { data } = await apiUser.createQrCode({ device_id: device_id.current })
      const a = new Date(data?.expiration_time)
      const b = new Date()
      const time = (a - b) / 1000
      setCount(Math.floor(time))
      setCode(data?.code)
      init()
      __time.current = setInterval(() => {
        setCount((c) => c - 1)
      }, [1000])
    } catch (error) {
      console.log(error)
    }
  }

  function resetCode() {
    device_id.current = "w-" + uuid()
    setCount(__count)
    getCode()
  }

  useEffect(() => {
    if (count === 0) {
      clearInterval(__time.current)
    }
  }, [count])

  useEffect(() => {
    device_id.current = "w-" + uuid()
    setCount(__count)
    getCode()
    return () => {
      clearInterval(__time.current)
    }
  }, [])

  return (
    <div className="h-full relative">
      <button className="absolute -top-6 -left-6 flex space-x-2 items-center" onClick={() => onChangeView("login")}>
        {back} <div className="text-dark-500">Quay lại</div>
      </button>
      <h2 className="text-dark-100 text-lg my-8 text-center font-semibold">Đăng nhập qua App Vina Sports</h2>
      <div className="w-60 m-auto">
        <div className="text-sm text-dark-500 text-center mb-4">
          Nhập mã code hoặc quét mã QR bằng ứng dụng Vina Sports:
        </div>
        <div className="mb-6">
          <div className="border-2 border-dark-500 text-dark-300 px-4 py-2 text-center rounded text-2xl mb-4 font-semibold">
            {code}
          </div>
          <div className="border-2 border-dark-500 text-center rounded h-60 w-full relative">
            <QR
              id="web-qr"
              value={code}
              size={240}
              level={"H"}
              includeMargin={true}
              bgColor="transparent"
              fgColor="#E6E6E6"
              // imageSettings={{
              //   src: "/qrcodevina.png",
              //   width: 52,
              //   height: 52,
              //   excavate: true
              // }}
            />
            {count === 0 && (
              <div className="inset-0 absolute z-10 bg-dark-900 bg-opacity-80">
                <div className="flex justify-center absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={resetCode}
                    className="bg-primary-500 w-full py-1 rounded flex space-x-2 text-gray-900 font-medium justify-center"
                  >
                    {reload} <span>Tải lại</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {count !== 0 ? (
        <div className="text-center text-dark-500 font-semibold">({convertTime(count)})</div>
      ) : (
        <div className="text-error-red-300 text-center">Mã QR/Code đã hết hạn, vui lòng tải lại</div>
      )}
    </div>
  )
}

const back = (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="#E6E6E6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
  </svg>
)

function convertTime(time) {
  const m = Math.floor(time / 60)
  const s = time % 60
  const __s = s > 9 ? s : "0" + s
  return m + ":" + __s
}

const reload = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)
