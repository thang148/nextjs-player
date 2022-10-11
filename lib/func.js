export function renderStatus({ status, match_time, pen_score, time_status }) {
  let text = time_status || ""
  let __class = ""
  if (status === 0) {
    const date = new Date(match_time * 1000)
    text = date.getHours() + ":" + addZero(date.getMinutes())
  }
  if (status === 1 || status === 3) {
    __class = "text-orange-400 font-bold"
  }
  if (status === 5) {
    text = "PEN" + pen_score
    __class = "text-orange-400 font-bold"
  }
  if (status === -11) text = "TBD"
  return { text, class: __class }
}

function addZero(i) {
  return i < 10 ? "0" + i : i
}
