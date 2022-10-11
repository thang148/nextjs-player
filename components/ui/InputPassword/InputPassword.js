import { Fragment, useState, forwardRef } from "react"
import cn from "classnames"
import s from "./Input.module.css"

// eslint-disable-next-line react/display-name
const InputPassword = forwardRef(({ error, ...rest }, ref) => {
  const [show, setShow] = useState(true)

  function onChangeShow() {
    setShow((c) => !c)
  }

  return (
    <Fragment>
      <div className="relative">
        <input
          ref={ref}
          autoComplete="new-password"
          className="border-b text-dark-300 border-gray-500 outline-none text-lg py-1 w-full bg-transparent"
          {...rest}
          type={show ? "password" : "text"}
          maxLength={20}
        />

        <div
          className={cn("absolute right-0 top-1/2 text-gray-400 text-sm", s.root)}
          role="button"
          tabIndex="-1"
          onKeyDown={onChangeShow}
          onClick={onChangeShow}
        >
          {show ? iconShow : iconHide}
        </div>
      </div>
      <div className="h-8">{error && <span className="text-red-500 text-sm">{error}</span>}</div>
    </Fragment>
  )
})
export default InputPassword

const iconShow = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const iconHide = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
)
