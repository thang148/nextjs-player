import Swiper from "components/Swiper"
import Slide from "components/Slide"
import { api } from "apiServer"
import { Layout } from "components/common"
import { Fragment } from "react"
function Component({ lists, slides }) {
  return (
    <section className="mb-12">
      <Slide slides={slides} />
      <div className="pl-10 2xl:pl-12 pt-0 mt-16 max-w-full overflow-x-hidden md:mt-0">
        {lists.map((item) => {
          return (
            <Fragment key={item.id}>
              <Swiper {...item} isLive={item.is_live && item?.events[0].type === 0} />
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}

export default Component
Component.Layout = Layout

export async function getServerSideProps({ req, res }) {
  const { cookies } = req
  let lists = [],
    slides = []
  try {
    const { data } = await api.getListForHome()
    if (data && data.length > 0) lists = data
  } catch (error) {
    console.log(error?.response?.data || error)
  }

  try {
    const { data } = await api.getSlides(cookies)
    if (data && data.length > 0) slides = data
  } catch (error) {
    console.log(error?.response?.data || error)
  }

  return { props: { lists, slides } }
}
