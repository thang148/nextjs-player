import s from "./Switch.module.css"

export default function Switch({ onChange }) {
  return (
    <label className={s.switch}>
      <input className={s.input} type="checkbox" onChange={onChange} />
      <span className={s.slider}></span>
    </label>
  )
}
