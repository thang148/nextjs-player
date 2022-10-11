import InputPassword from "components/ui/InputPassword"
import InputPhone from "components/ui/InputPhone"
import { apiUser } from "api"
import LoginGoogleAndFacebook from "./LoginGoogleAndFacebook"
import { useEffect, useRef, useState } from "react"
import useStore from "components/ui/Context"
import cn from "classnames"
import { Modal, notification } from "components/ui"
import { setAccessToken, setRefreshToken } from "lib/Cookies"
import Register from "./Register"
import UpdatePhone from "./UpdatePhone"
import QRCode from "./QRcode"
const initParams = { phone: "", password: "" }

export default function LoginForm() {
  const { setUser } = useStore()
  const [view, setView] = useState("login")
  const [validate, setValidate] = useState(false)
  const [params, setParams] = useState(initParams)
  const [errors, setErrors] = useState(initParams)
  const __forgotPassword = useRef(false)
  const [showModal, setShowModal] = useState(false)

  async function onSubmit() {
    const { phone, password } = params
    let _error = {}
    if (!phone) _error.phone = "Số điện thoại không được để trống!"
    if (Number(phone) && phone.length < 9) _error.phone = "Phone gồm 10 số bắt đầu từ số 0!"
    if (password.length < 6) {
      _error.password = "Mật khẩu lớn hơn 6 ký tự!"
    }

    if (Object.keys(_error).length > 0) {
      setErrors(_error)
      return
    } else {
      setErrors(initParams)
    }

    try {
      let res
      if (view === "login") {
        const _params = { name: params.phone, password: params.password }
        res = await apiUser.login(_params)
        // notification.success({ message: "Đăng nhập thành công!" })
        if (res.success) onLogin(res.data)
      } else {
        const _params = { phone: params.phone, password: params.password }
        res = await apiUser.register(_params)
        notification.success({ message: "Đăng ký thành công xin vui lòng đăng nhập!" })
        setView("login")
      }
    } catch (error) {
      let _message = "Hệ thống bị gián đoạn xin vui lòng thử lại sau!"
      const data = error?.response?.data
      if (data) {
        _message = "Kiểm tra lại tài khoản và mật khẩu hoặc SĐT chưa đăng ký!"
      }
      notification.error({
        message: _message
      })
    }
  }

  async function onLogin(res) {
    const { access_token, refresh_token } = res
    setAccessToken(access_token)
    setRefreshToken(refresh_token)
    try {
      const { data, success } = await apiUser.getMe()
      if (success) {
        if (data.phone?.length < 1 || data.phone === null) {
          setView("updatephone")
        } else {
          setUser(data)
          notification.success({ message: "Đăng nhập thành công!" })
        }
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  function onChangeData(k, value) {
    const __value = value[value.length - 1]
    if (view == "register" && k === "password" && __value === " ") {
      notification.error({
        message: "Mật khẩu không được chứa dấu cách!"
      })
      return
    }
    if (k === "phone" && value.length > 0) {
      if (value.length === 1 && value[0] !== "0") {
        notification.error({
          message: "Số điện thoại bắt đầu từ số 0"
        })
        setErrors((state) => ({ ...state, phone: "Số điện thoại bắt đầu từ số 0" }))
        return
      }
    }
    setErrors({})
    setParams((s) => ({ ...s, [k]: value }))
  }

  function onChangePassword() {
    __forgotPassword.current = true
    setView("register")
  }

  function onChangeView(value) {
    __forgotPassword.current = false
    setView(value)
    setParams(initParams)
  }

  useEffect(() => {
    const { phone, password } = params
    if (phone.length === 10 && password.length > 5) {
      setValidate(true)
    } else {
      setValidate(false)
    }
  }, [params])

  const { password, phone } = params
  return (
    <div className="flex justify-between flex-col modal_login bg-dark-700 text-dark-900 rounded">
      <div className="p-4 flex-grow flex-col flex justify-center sm:p-8 md:p-10">
        {view === "login" && (
          <div>
            <h1 className="text-3xl text-center font-bold text-dark-100 mb-6">ĐĂNG NHẬP</h1>
            <InputPhone
              onChange={(value) => onChangeData("phone", value?.trim())}
              placeholder={"Nhập số điện thoại của bạn"}
              error={errors.phone}
              name="phone"
              value={phone}
            />

            <InputPassword
              onChange={(e) => onChangeData("password", e.target.value)}
              placeholder="Nhập mật khẩu"
              name="password"
              error={errors.password}
              value={password}
            />

            <button
              onClick={onSubmit}
              className={cn(
                "m-auto rounded py-2 px-8 text-lg flex items-center mb-4 space-x-4 hover:bg-primary-hover text-dark",
                validate ? "bg-primary-500 font-semibold" : "bg-primary-500  font-semibold"
              )}
            >
              <span>ĐĂNG NHẬP</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div className="text-center">
              <button className="text-dark-100 underline" onClick={onChangePassword}>
                Bạn quên mật khẩu?
              </button>
            </div>
          </div>
        )}

        {view === "qr" && <QRCode onChangeView={onChangeView} onLogin={onLogin} />}

        {view === "register" && (
          <Register onLogin={onLogin} setView={setView} isResetPassword={__forgotPassword.current} />
        )}
        {view === "updatephone" && (
          <UpdatePhone onLogin={onLogin} setView={setView} isResetPassword={__forgotPassword.current} />
        )}
        {view === "login" && (
          <div>
            <div className="text-dark-300 text-center mt-8 text-sm">hoặc đăng nhập bằng</div>
            <LoginGoogleAndFacebook onChangeView={onChangeView} onLogin={onLogin} />
          </div>
        )}
      </div>

      {view === "login" && (
        <div className="text-center text-dark-500 bg-dark-500 px-4 py-2 br-b-8">
          <div className="text-sm">Bạn chưa có tài khoản?</div>
          <button
            className={"text-dark-100 cursor-pointer font-bold text-lg underline"}
            onClick={() => onChangeView("register")}
          >
            ĐĂNG KÝ
          </button>
        </div>
      )}

      {view === "register" && (
        <div className="text-center text-dark-500 bg-dark-500 py-2 px-4 br-b-8">
          <div className="text-sm">Bạn đã có tài khoản?</div>
          <button
            className="text-dark-100 cursor-pointer font-semibold text-lg underline"
            onClick={() => onChangeView("login")}
          >
            ĐĂNG NHẬP
          </button>
        </div>
      )}
    </div>
  )
}
