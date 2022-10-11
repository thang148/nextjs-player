import { Fragment, forwardRef } from "react"

function convertPhone(phone) {
  if (phone?.length > 0) {
    let cvPhone = ""
    for (let i = 0; i < phone.length; i++) {
      if (i === 4 || i === 7) {
        cvPhone += "."
      }
      cvPhone += phone[i]
    }
    return cvPhone
  }
  return phone
}

// eslint-disable-next-line react/display-name
const Input = forwardRef(({ error, value, onChange, ...rest }, ref) => {
  function onChangeData(e) {
    onChange(e.target.value?.replaceAll(".", ""))
  }
  return (
    <Fragment>
      <div className="relative">
        <input
          ref={ref}
          onChange={onChangeData}
          autoComplete="new-password"
          className="border-b text-dark-300 border-gray-500 outline-none text-lg py-1 w-full bg-transparent"
          {...rest}
          value={convertPhone(value)}
          type="tel"
          maxLength={12}
        />
      </div>
      <div className="h-8">{error && <span className="text-red-500 text-sm">{error}</span>}</div>
    </Fragment>
  )
})
export default Input
