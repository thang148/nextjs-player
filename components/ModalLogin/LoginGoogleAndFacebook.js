import React from "react"
import { GoogleLogin } from "react-google-login"
import FacebookLogin from "react-facebook-login"
import { apiUser } from "api"
import { notification } from "components/ui"
import s from "./LoginSocial.module.css"
import cn from "classnames"
import KEY from "utils/Const"

const LoginGoogleAndFacebook = ({ onLogin, onChangeView }) => {
  async function login(provider_access_token, provider_name) {
    try {
      const { data } = await apiUser.signInBySocial({ provider_name, provider_access_token })
      notification.success({ message: "Đăng nhập thành công!" })
      onLogin(data)
    } catch (e) {
      console.log(e)
    }
  }

  function loginFail(response) {
    console.log(response)
  }
  function responseGoogleSuccess(params) {
    login(params.tokenId, "google")
  }
  function responseFacebook(data) {
    // console.log("params", data)
    login(data.accessToken, "facebook")
  }

  return (
    <div>
      <button
        onClick={() => onChangeView("qr")}
        className={cn(
          "my-4 w-full text-dark-800 font-semibold bg-dark-50 flex items-center justify-center rounded",
          s.app
        )}
      >
        {app} App Vina Sports
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <GoogleLogin
            clientId={KEY.KEY_GOOGLE}
            render={(renderProps) => (
              <button onClick={() => renderProps.onClick()} className={cn(s.button, s.gg)}>
                <div className={s.icon}>{gg}</div>
                <div>Google</div>
              </button>
            )}
            onSuccess={responseGoogleSuccess}
            onFailure={loginFail}
            cookiePolicy={"single_host_origin"}
          />
        </div>
        <div className="col-span-1">
          <FacebookLogin
            appId={KEY.KEY_FACEBOOK}
            fields="name,email"
            textButton=""
            cssClass={"w-full"}
            icon={
              <div className={cn(s.button, s.fb)}>
                <div className={s.icon}>{fb}</div>
                <div>Facebook</div>
              </div>
            }
            callback={responseFacebook}
          />
        </div>
      </div>
      {/* <GoogleLogout
                clientId={KEY.KEY_GOOGLE}
                buttonText="Logout"
                onLogoutSuccess={logout}
            ></GoogleLogout> */}
    </div>
  )
}

export default LoginGoogleAndFacebook

const gg = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27.7666 13.6498H26.8V13.6H16V18.4H22.7818C21.7924 21.1942 19.1338 23.2 16 23.2C12.0238 23.2 8.80001 19.9762 8.80001 16C8.80001 12.0238 12.0238 8.80001 16 8.80001C17.8354 8.80001 19.5052 9.49241 20.7766 10.6234L24.1708 7.22921C22.0276 5.2318 19.1608 4 16 4C9.37301 4 4 9.37301 4 16C4 22.627 9.37301 28 16 28C22.627 28 28 22.627 28 16C28 15.1954 27.9172 14.41 27.7666 13.6498Z"
      fill="#E6E6E6"
    />
    <path
      d="M5.38356 10.4146L9.32617 13.306C10.393 10.6648 12.9766 8.80001 16 8.80001C17.8354 8.80001 19.5052 9.49241 20.7766 10.6234L24.1708 7.22921C22.0276 5.2318 19.1608 4 16 4C11.3908 4 7.39356 6.6022 5.38356 10.4146Z"
      fill="#E6E6E6"
    />
    <path
      d="M16 28C19.0996 28 21.916 26.8138 24.0454 24.8848L20.3314 21.742C19.0861 22.6891 17.5645 23.2013 16 23.2C12.8788 23.2 10.2286 21.2098 9.23019 18.4324L5.31699 21.4474C7.30299 25.3336 11.3362 28 16 28Z"
      fill="#E6E6E6"
    />
    <path
      d="M27.7666 13.6498H26.8V13.6H16V18.4H22.7818C22.3085 19.7298 21.456 20.8919 20.3296 21.7426L20.3314 21.7414L24.0454 24.8842C23.7826 25.123 28 22 28 16C28 15.1954 27.9172 14.41 27.7666 13.6498Z"
      fill="#E6E6E6"
    />
  </svg>
)

const fb = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.5481 4.00499L18.6699 4C15.4362 4 13.3465 6.31828 13.3465 9.90643V12.6297H10.4526C10.2025 12.6297 10 12.8489 10 13.1193V17.065C10 17.3354 10.2027 17.5544 10.4526 17.5544H13.3465V27.5106C13.3465 27.781 13.549 28 13.7991 28H17.5749C17.825 28 18.0275 27.7808 18.0275 27.5106V17.5544H21.4112C21.6613 17.5544 21.8638 17.3354 21.8638 17.065L21.8652 13.1193C21.8652 12.9895 21.8174 12.8651 21.7326 12.7733C21.6479 12.6814 21.5324 12.6297 21.4123 12.6297H18.0275V10.3212C18.0275 9.21157 18.272 8.64829 19.6087 8.64829L21.5477 8.64755C21.7975 8.64755 22 8.42833 22 8.15817V4.49437C22 4.22446 21.7977 4.00549 21.5481 4.00499Z"
      fill="#E6E6E6"
    />
  </svg>
)

const app = (
  <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 8H14V14H8V8ZM24 8V14H18V8H24ZM18 19H20V17H18V15H20V17H22V15H24V17H22V19H24V22H22V24H20V22H17V24H15V20H18V19ZM20 19V22H22V19H20ZM8 24V18H14V24H8ZM10 10V12H12V10H10ZM20 10V12H22V10H20ZM10 20V22H12V20H10ZM8 15H10V17H8V15ZM13 15H17V19H15V17H13V15ZM15 10H17V14H15V10ZM6 6V10H4V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H10V6H6ZM26 4C26.5304 4 27.0391 4.21071 27.4142 4.58579C27.7893 4.96086 28 5.46957 28 6V10H26V6H22V4H26ZM6 22V26H10V28H6C5.46957 28 4.96086 27.7893 4.58579 27.4142C4.21071 27.0391 4 26.5304 4 26V22H6ZM26 26V22H28V26C28 26.5304 27.7893 27.0391 27.4142 27.4142C27.0391 27.7893 26.5304 28 26 28H22V26H26Z"
      fill="#006DFF"
    />
  </svg>
)
