/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link"
import Image from "next/image"
// import { ScrollToTop } from "components/ui"
import ModalLive from "components/ModalLive"
import { icLogo } from "components/ui/Icons"
import { QrcodeVina } from "components/ui/Icons"

export default function Footer() {
  return (
    <footer className="bg-dark-700 text-dark-500">
      <div className="max-w-screen-xl p-8 m-auto">
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-4">
          <div className="col-span-8">
            <div className="hidden mb-4 md:block">
              <Link href="/">
                <a>{icLogo}</a>
              </Link>
            </div>
            <p className="mb-4 mt-2 text-sm text-justify" style={{ maxWidth: 500 }}>
              Ứng dụng số một về Thể thao, Bóng đá Việt Nam; truyền hình trực tuyến tất cả các kênh thể thao thuộc hệ
              thống VTVcab: On Football, Vina Sports, Vina Sports+, On Golf.
            </p>
            <div className="flex space-x-4 items-center">
              <div className="cursor-pointer">
                <a target="__blank" href="https://www.facebook.com/Onsportchannel/">
                  {faceBook}
                </a>
              </div>
              <div className="cursor-pointer">
                <a href="https://www.youtube.com/channel/UCIWo7q6irZUBaoPOrlf5IVw" target="__blank">
                  {youtube}
                </a>
              </div>
              <div className="mt-2">
                <a href="http://online.gov.vn/Home/WebDetails/88056" target="__blank" className="hidden md:block">
                  <Image
                    src="https://j03qukjhr2obj.vcdn.cloud/image-upload/cae45c4d-9603-4048-adf7-fce15291cb88.png"
                    width={100}
                    height={38}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-4 flex flex-col justify-between">
            <div className="mt-4 sm:mt-0 text-sm flex justify-end">
              <div className="">
                <div className="mb-2">Tải ứng dụng tại:</div>
                <div className="md:flex">
                  <div className="mr-6 hidden md:flex">
                    <span style={{ width: 89, height: 80 }}>{QrcodeVina}</span>
                  </div>
                  <div className="flex md:block">
                    <div className="mb-1 mr-6 md:mr-0">
                      <a
                        href="https://apps.apple.com/vn/app/on-sports/id1282845933#?platform=iphone"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          src="https://j03qukjhr2obj.vcdn.cloud/image-upload/91af4b21-6541-4aac-b557-eedde81a0f0a.png"
                          width={121}
                          height={35}
                        />
                      </a>
                    </div>
                    <div>
                      <div style={{ height: 35 }}>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.vtvcab.onsports"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Image
                            src="https://j03qukjhr2obj.vcdn.cloud/image-upload/3c3bd6a8-bf15-48ab-9bcb-ec12ced5598e.png"
                            width={121}
                            height={35}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-700 my-4"></div>
        <div className="flex flex-col-reverse md:grid grid-cols-3 text-sm gap-4">
          <div className="col-span-2 text-dark-500 text-xs leading-5">
            <div className="font-semibold mb-2">Tổng Công ty Truyền hình Cáp Việt Nam.</div>
            <div>
              Địa chỉ: Số 3/84 Ngọc Khánh, quận Ba Đình, Hà Nội, Việt Nam
              <br />
              Điện thoại: 19001515 &nbsp;&nbsp;&nbsp;&nbsp; Email: info@vtvcab.vn
            </div>

            <div className=" font-semibold mt-4">
              <Link href="/chinh-sach">
                <span className="cursor-pointer">Chính sách bảo mật</span>
              </Link>
            </div>
          </div>
          <div className="col-span-1 text-dark-500 text-xs leading-5">
            Giấy chứng nhận đăng ký doanh nghiệp số 0105926285 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp lần đầu
            ngày 26 tháng 6 năm 2012, thay đổi lần thứ 5 ngày 05 tháng 10 năm 2017.
          </div>
        </div>
      </div>
      <ModalLive />
      {/* <ScrollToTop /> */}
    </footer>
  )
}

const faceBook = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.1"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
      fill="#B3B3B3"
    />
    <path
      d="M12.9315 17.998V12.534H14.7749L15.0489 10.3947H12.9315V9.03199C12.9315 8.41466 13.1035 7.99199 13.9895 7.99199H15.1122V6.08466C14.5659 6.02612 14.0169 5.99785 13.4675 5.99999C11.8382 5.99999 10.7195 6.99466 10.7195 8.82066V10.3907H8.88818V12.53H10.7235V17.998H12.9315Z"
      fill="#B3B3B3"
    />
  </svg>
)

const youtube = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.1"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
      fill="#B3B3B3"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.0009 7.87464C17.5517 8.02577 17.9854 8.47108 18.1326 9.03659C18.4001 10.0615 18.4001 12.2 18.4001 12.2C18.4001 12.2 18.4001 14.3384 18.1326 15.3634C17.9854 15.9289 17.5517 16.3742 17.0009 16.5254C16.0028 16.8 12.0001 16.8 12.0001 16.8C12.0001 16.8 7.99741 16.8 6.99923 16.5254C6.44846 16.3742 6.01472 15.9289 5.86752 15.3634C5.6001 14.3384 5.6001 12.2 5.6001 12.2C5.6001 12.2 5.6001 10.0615 5.86752 9.03659C6.01472 8.47108 6.44846 8.02577 6.99923 7.87464C7.99741 7.59998 12.0001 7.59998 12.0001 7.59998C12.0001 7.59998 16.0028 7.59998 17.0009 7.87464ZM10.8001 10.3999V14.3999L14.0001 12.4L10.8001 10.3999Z"
      fill="#B3B3B3"
    />
  </svg>
)
