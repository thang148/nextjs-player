/* eslint-disable jsx-a11y/anchor-is-valid */
import InputPassword from "components/ui/InputPassword"
import { apiUser } from "api"
import { useState, useEffect, useRef } from "react"
import OtpInput from "react-otp-input"
import cn from "classnames"
import { notification } from "components/ui"
import { setAccessToken, setRefreshToken } from "lib/Cookies"
import InputPhone from "components/ui/InputPhone"

export default function Register({ isResetPassword, setView }) {
  const [step, setStep] = useState(1)
  const [reCount, setReCount] = useState(1)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState()
  const __user = useRef({})
  const __input1 = useRef()

  function onChangePhone(value) {
    if (value.length === 1 && value[0] !== "0") {
      notification.error({
        message: "Điện thoại phải là số!"
      })
      return
    }
    setPhone(value)
  }

  async function sendOtp() {
    try {
      if (!phone?.length) {
        notification.error({
          message: "Số điện thoại không được để trống!"
        })
        return
      }
      if (!isResetPassword) {
        const { data } = await apiUser.checkPhoneExist({ phone })
        if (data?.verified) {
          notification.error({
            message: "Số điện thoại đã đăng ký!"
          })
          return
        }
      }
      setLoading(true)
      const { success } = await apiUser.sendOtp({ phone })
      if (success) {
        setReCount((c) => c + 1)
        setStep(2)
      }
    } catch (error) {
      let _message = "Hệ thống bị gián đoạn xin vui lòng thử lại sau!"
      const data = error?.response?.data
      if (data) {
        _message = data.error_message[0]
      }
      notification.error({
        message: _message
      })
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtp() {
    try {
      if (otp?.length < 6) {
        notification.error({ message: "OTP không hợp lệ!" })
        return
      }
      const { data, success } = await apiUser.verifyOtp({ phone, otp_code: otp })
      if (success) {
        setLoading(true)
        setAccessToken(data?.access_token)
        setRefreshToken(data?.refresh_token)
        __user.current = data
        setStep(3)
      }
    } catch (error) {
      notification.error({
        message: "Mã OTP sai hoặc đã hết hạn!"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (step === 1) __input1.current.focus()
    if (otp) setOtp("")
  }, [step])

  return (
    <div>
      {step > 1 && (
        <button onClick={() => setStep(1)} className="absolute left-2 top-2 text-dark-100">
          {icBack}
        </button>
      )}
      <h1 className="text-3xl text-center font-bold text-dark-100 mb-12 mt-4">
        {step === 1 && <span>{isResetPassword ? "ĐẶT LẠI MẬT KHẨU" : "ĐĂNG KÝ"}</span>}
        {step === 2 && "XÁC THỰC"}
        {step === 3 && "ĐẶT MẬT KHẨU"}
      </h1>
      {step === 1 && (
        <div>
          <InputPhone
            onChange={(value) => onChangePhone(value?.trim())}
            ref={__input1}
            placeholder={"Số điện thoại..."}
            name="phone"
            value={phone}
          />
          <div>
            <button
              disabled={loading}
              onClick={sendOtp}
              className={cn(
                "m-auto rounded py-2 px-4 text-lg flex items-center mb-4 space-x-4 hover:bg-primary-hover font-medium",
                phone?.length > 8 ? "bg-primary-500 text-dark" : "bg-primary-500 text-dark"
              )}
            >
              <span>TIẾP TỤC</span>
              <span>{ic}</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-4 text-center text-dark-300">Nhập mã OTP được gửi tới SĐT của bạn</div>
          <div className="flex justify-center mb-6 text-dark-300">
            <OtpInput
              value={otp}
              onChange={(e) => setOtp(e)}
              numInputs={6}
              shouldAutoFocus={true}
              isInputNum={true}
              separator={<span> &nbsp;</span>}
              inputStyle={"input_otp"}
            />
          </div>
          <div>
            <Coundown expired={60} sendOtp={sendOtp} reCount={reCount} setOtp={setOtp} otp={otp} />
          </div>
          <div>
            <button
              disabled={loading}
              onClick={verifyOtp}
              className={cn(
                "m-auto rounded py-2 px-4 text-lg flex items-center mb-4 space-x-4 hover:bg-primary-hover font-medium",
                otp?.length === 6 ? "bg-primary-500 text-dark" : "bg-blue-500 text-dark"
              )}
            >
              <span>TIẾP TỤC</span>
              {ic}
            </button>
          </div>
        </div>
      )}

      {step === 3 && <SetupPassword {...__user.current} setView={setView} phone={phone} />}
    </div>
  )
}

function SetupPassword({ user_id, phone, setView }) {
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [loading, setLoading] = useState(false)
  const [textError, setError] = useState({ password: "", password2: "" })
  const __input = useRef()

  function onChangePassword(e) {
    setPassword(e.target.value)
  }
  function onChangePassword2(e) {
    const text = e.target.value
    setPassword2(text)
  }

  async function onFinish() {
    if (password?.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự!")
      return
    }
    if (password !== password2) {
      setError("Mật khẩu phải trùng nhau!")
      return
    }
    try {
      setLoading(true)
      await apiUser.setPassword(user_id, { new_password: password })
      setError("Tạo mật khẩu thành công!")
      setView("login")
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let __error = {}
    if (password.length < 6) {
      __error.password = "Mật khẩu tối thiểu 6 ký tự!"
    }
    if (password2 !== password) {
      __error.password2 = "Mật khẩu phải trùng nhau"
    }
    if (password2.length < 6) {
      __error.password2 = "Mật khẩu tối thiểu 6 ký tự!"
    }
    setError(__error)
  }, [password2, password])

  useEffect(() => {
    if (__input.current) __input.current.focus()
  }, [__input.current])

  const check = password?.length > 5 && password === password2
  return (
    <div>
      <div className="text-center text-dark-300">
        Xin chào, <span className="font-semibold text-dark-100">{phone}</span>
      </div>
      <InputPassword
        ref={__input}
        onChange={onChangePassword}
        placeholder="Nhập mật khẩu"
        error={textError.password}
        name="phone"
        value={password}
      />

      <InputPassword
        onChange={onChangePassword2}
        error={textError.password2}
        placeholder="Nhập lại mật khẩu"
        name="phone"
        value={password2}
      />
      <div>
        <button
          disabled={loading}
          onClick={onFinish}
          className={cn(
            "m-auto rounded text-dark py-2 px-4 text-lg flex items-center mb-4 space-x-4 hover:bg-primary-hover font-semibold",
            check ? "bg-primary-500 text-dark" : "bg-primary-500 text-dark"
          )}
        >
          <span>HOÀN TẤT</span>
          <span>{ic}</span>
        </button>
      </div>
    </div>
  )
}

function Coundown({ sendOtp, expired, reCount, setOtp }) {
  const [counter, setCounter] = useState(expired)
  const __time = useRef()

  function reSend() {
    setOtp("")
    sendOtp()
  }

  useEffect(() => {
    if (expired > 0) {
      setCounter(expired)
      __time.current = setInterval(() => {
        setCounter((c) => c - 1)
      }, 1000)
    }
    return () => {
      clearInterval(__time.current)
    }
  }, [reCount])

  useEffect(() => {
    if (counter === 0) {
      clearInterval(__time.current)
      __time.current = null
    }
  }, [counter])

  return (
    <div className="flex justify-center mb-4 text-dark-300">
      {counter > 0 ? (
        <div className="text-center h3">Vui lòng chờ {counter} để gửi lại</div>
      ) : (
        <div className="text-sm flex">
          Bạn không nhận được mã? &nbsp;
          <div onClick={reSend} onKeyUp={reSend} role="button" tabIndex="0">
            <span className="text-blue-500 cursor-pointer">Gửi lại</span>
          </div>
        </div>
      )}
    </div>
  )
}
const ic = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
)

const icBack = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)
