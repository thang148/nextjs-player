/* eslint-disable jsx-a11y/anchor-is-valid */
import { api } from "apiServer"
import { Layout } from "components/common"
import CardLive from "components/CardLive"
import CardVod from "components/CardVod"
import { useEffect, useRef, useState } from "react"

let calling = false

function getClass(isLive) {
  if (isLive) {
    return "mb-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4"
  } else {
    return "mb-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4"
  }
}
function Component({ lists, slug, video }) {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(lists)
  const pageNum = useRef(1)
  const maxCount = useRef(50)
  useEffect(() => {
    function onScroll() {
      if (window.scrollY + window.innerHeight > (document.body.scrollHeight * 6) / 7) {
        if (!calling) {
          setLoading(true)
        }
      }
    }

    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  async function fetch() {
    try {
      pageNum.current = pageNum.current + 1
      const { data, count } = await api.getFullByBlock(null, slug, {
        page_num: pageNum.current,
        page_size: 24
      })
      maxCount.current = count
      setRows([...rows, ...data])
    } catch (error) {
      console.log(error.response)
    } finally {
      setLoading(false)
      calling = false
    }
  }

  useEffect(() => {
    if (loading && maxCount.current > rows.length) fetch()
  }, [loading])

  const { is_live, name } = video
  return (
    <section className="p-4 md:p-8 lg:p-12">
      <h2 className="relative uppercase mb-4 text-sm md:text-lg lg:text-xl font-semibold text-dark-100">{name}</h2>
      <div className={getClass(is_live && rows[0].type === 0)}>
        {rows?.length > 0 &&
          rows?.map((item) => {
            const { id, type } = item
            return <div key={id}>{is_live && type === 0 ? <CardLive {...item} /> : <CardVod {...item} />}</div>
          })}
      </div>
    </section>
  )
}

export default Component
Component.Layout = Layout

export async function getServerSideProps({ req, query, res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=29")
  let lists = [],
    video = {}
  const { cookies } = req
  const { slug } = query
  try {
    const { data, block } = await api.getFullByBlock(cookies?.accessToken, slug, {
      page_num: 1,
      page_size: 24
    })

    lists = data
    video = block
  } catch (error) {
    console.log(error.response)
  }
  return { props: { lists, video, slug } }
}
