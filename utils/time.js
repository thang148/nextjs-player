import { Fragment } from "react"

export function renderTimeFromNow(string) {
  const toDay = new Date()
  const date = new Date(string)
  const diffDate = (toDay.getTime() - date.getTime()) / 1000
  const day = Math.floor(diffDate / (3600 * 24))
  if (day > 365) return Math.floor(day / 365) + " năm trước"
  if (day > 30) return Math.floor(day / 30) + " tháng trước"
  if (day > 0) return day + " ngày trước"
  const hour = Math.floor(diffDate / 3600)
  if (hour > 0) return Math.floor(hour) + " giờ trước"
  const _hour = diffDate % 3600
  const minute = Math.floor(_hour / 60)
  if (minute > 0) return Math.floor(minute) + " phút trước"
  const second = Math.floor(_hour % 60)
  return Math.floor(second) + " giây trước"
}

export function renderTime(string, isYear) {
  if (!string) return ""
  const date = new Date(string)
  const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  return (
    <span>
      {date.getHours()}:{minute} | {date.getDate()}/{date.getMonth() + 1}
      {isYear && <Fragment>/{date.getFullYear()}</Fragment>}
    </span>
  )
}

export function renderHours(string) {
  const date = new Date(string)
  const minute = date.getMilliseconds() < 10 ? "0" + date.getMilliseconds() : date.getMilliseconds()
  return (
    <span>
      {date.getHours()}:{minute}
    </span>
  )
}

export function convertSeccondToTimePlay(n) {
  let h = Math.floor(n / 3600)
  let m = n % 3600
  let _m = Math.floor(m / 60)
  let s = m % 60
  if (h === 0) {
    h = ""
  } else {
    h = h + ":"
  }
  if (_m < 10) _m = "0" + _m
  if (s < 10) s = "0" + s
  return h + _m + ":" + s
}
