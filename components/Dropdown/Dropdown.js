import ClickOutside from "lib/click-outside"
import cn from "classnames"

import { useState } from "react"
import s from "./Dropdown.module.css"

export default function Dropdown({ onChange, leagues }) {
  const [show, setShow] = useState(false)

  const [text, setText] = useState("Chọn giải đấu")

  function onClose() {
    setShow(false)
  }

  function onShow() {
    setShow((c) => !c)
  }

  function onChangeLeague(v) {
    onChange(v.id)
    setText(v.name)
    setShow(false)
  }

  const __class = show ? s.show : s.hide
  return (
    <div className={s.dr}>
      <ClickOutside onClick={onClose}>
        <div>
          <div className={s.text} role="button" tabIndex="0" onKeyPress={onShow} onClick={onShow}>
            <div className="line-clamp-1">{text}</div> {downIc}
          </div>
          {show && (
            <ul className={cn(s.ul, __class)}>
              {leagues?.map((item) => {
                const { name, id, short_name } = item
                return (
                  <div
                    className={s.li}
                    key={id}
                    role="button"
                    onKeyDown={() => onChangeLeague(item)}
                    tabIndex="0"
                    onClick={() => onChangeLeague(item)}
                  >
                    <li>{short_name || name}</li>
                  </div>
                )
              })}
            </ul>
          )}
        </div>
      </ClickOutside>
    </div>
  )
}
const downIc = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ minWidth: 14 }}
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
)
