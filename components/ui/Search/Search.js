import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function Search() {
  const router = useRouter()
  // console.log(router)
  const [text, setText] = useState(router?.query?.q || "")

  function onSearch() {
    if (text.length > 0) router.push(`/tim-kiem?q=${text}`)
  }

  function onChange(e) {
    setText(e.target.value)
  }

  function onKeyPress(e) {
    if (e.charCode === 13 && text.length > 0) {
      router.push(`/tim-kiem?q=${text}`)
    }
  }

  useEffect(() => {
    // console.log(router)
    if (router.pathname !== "/tim-kiem") setText("")
  }, [router])

  return (
    <div className="relative">
      <input
        value={text}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className=" rounded-full text-sm bg-transparent h-9 px-4 pl-10 border w-60 border-dark-100"
        placeholder="Tìm kiếm"
      />
      <button
        onClick={onSearch}
        className="absolute text-dark-500 p-1 left-1 z-20 top-1/2 transform -translate-y-1/2 rounded cursor-pointer"
      >
        {iconSearch}
      </button>
    </div>
  )
}

const iconSearch = (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.8496 19C16.2679 19 19.8496 15.4183 19.8496 11C19.8496 6.58172 16.2679 3 11.8496 3C7.43133 3 3.84961 6.58172 3.84961 11C3.84961 15.4183 7.43133 19 11.8496 19Z"
      stroke="#B3B3B3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M21.8496 21L17.4996 16.65" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
