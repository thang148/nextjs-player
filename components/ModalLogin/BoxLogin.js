/* eslint-disable jsx-a11y/anchor-is-valid */
import useStore from "components/ui/Context"
import { Avatar, Search } from "components/ui"
import s from "./LoginSocial.module.css"
import cn from "classnames"

export default function ModalLogin({ onCancel }) {
  const { userInfo, togleModalLogin } = useStore()

  function onChangeModal() {
    togleModalLogin()
    if (onCancel) onCancel()
  }

  return (
    <div className={cn("flex justify-between items-center", s.root)}>
      <Search />
      {userInfo.fullname ? (
        <Avatar onCancel={onCancel} />
      ) : (
        <div className="flex items-center" onClick={onChangeModal} role="button" tabIndex="0" onKeyDown={onChangeModal}>
          {icon} <div className="hidden xl:block ml-1">Đăng nhập</div>
        </div>
      )}
    </div>
  )
}

const icon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.0001 10.8C12.9549 10.8 13.8706 10.4207 14.5457 9.74556C15.2208 9.07043 15.6001 8.15475 15.6001 7.19998C15.6001 6.2452 15.2208 5.32952 14.5457 4.65439C13.8706 3.97926 12.9549 3.59998 12.0001 3.59998C11.0453 3.59998 10.1296 3.97926 9.45451 4.65439C8.77938 5.32952 8.4001 6.2452 8.4001 7.19998C8.4001 8.15475 8.77938 9.07043 9.45451 9.74556C10.1296 10.4207 11.0453 10.8 12.0001 10.8ZM3.6001 21.6C3.6001 20.4969 3.81737 19.4046 4.23951 18.3854C4.66165 17.3663 5.28039 16.4403 6.0604 15.6603C6.84041 14.8803 7.76642 14.2615 8.78556 13.8394C9.80469 13.4172 10.897 13.2 12.0001 13.2C13.1032 13.2 14.1955 13.4172 15.2146 13.8394C16.2338 14.2615 17.1598 14.8803 17.9398 15.6603C18.7198 16.4403 19.3385 17.3663 19.7607 18.3854C20.1828 19.4046 20.4001 20.4969 20.4001 21.6H3.6001Z"
      fill="currentColor"
    />
  </svg>
)
