import useStore from "components/ui/Context"
import dynamic from "next/dynamic"
import { Modal } from "components/ui"
const LoginForm = dynamic(() => import("./LoginForm"), { ssr: false })

export default function ModalLogin() {
  const { isShowModalLogin, togleModalLogin } = useStore()

  function closeModal() {
    togleModalLogin(false)
  }

  return (
    <Modal isOpen={isShowModalLogin} onCancel={closeModal}>
      <LoginForm />
    </Modal>
  )
}
