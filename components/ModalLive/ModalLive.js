import useStore from "components/ui/Context"
import { Modal } from "components/ui"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function ModalLive() {
  const router = useRouter()
  const { modalLive, setModalLive } = useStore()
  const { show, info, isVod } = modalLive

  function onClose() {
    setModalLive({
      show: false,
      info: {}
    })
  }
  useEffect(() => {
    onClose()
  }, [router])

  return (
    <Modal isOpen={show} onCancel={onClose}>
      <div className="p-6">
        <div className="text-xl text-dark-100 mb-4 text-center">Thông báo</div>
        <p className="text-dark-300 text-center">
          {!isVod && info?.home_name ? (
            <span>
              Sự kiện {info?.home_name} - {info?.away_name}
            </span>
          ) : (
            <span>{info?.title}</span>
          )}
          <br />
          sẽ diễn ra vào lúc {renderTime(info?.start_time)}
          <p className="mb-4">Mời bạn thưởng thức các nội dung hấp dẫn khác</p>
        </p>
        <div className="flex justify-center">
          <button onClick={onClose} className="rounded-full bg-dark-700 px-12 py-1 border border-dark-300">
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}
function renderTime(string) {
  const date = new Date(string)
  const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  return (
    <span>
      {date.getHours()}:{minute} ngày {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
    </span>
  )
}
