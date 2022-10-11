import Link from "next/link"
import { removeToken } from "lib/Cookies"
import { useEffect } from "react"
import useStore from "components/ui/Context"

export default function Custom404() {
  const resetUser = useStore().setUser
  useEffect(() => {
    if (window.location.pathname === "/profile") {
      console.log(window.location.pathname)
      removeToken()
      resetUser(false)
    }
  }, [])
  return (
    <div className="m-auto p-4 text-center">
      <h1 className="font-semibold mb-4 text-dark-500">Trang không tồn tại</h1>
      <Link href="/">
        <button className="text-2xl font-bold bg-secondary text-white rounded px-4 py-2">Trang chủ</button>
      </Link>
    </div>
  )
}
