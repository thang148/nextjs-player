import axios from "axios"
import { Layout } from "components/common"
import { useEffect, useRef, useState, Fragment } from "react"
import cn from "classnames"
import CardVod from "components/CardVod"

let init = [1, 2, 3, 4, 5]
let calling = false
export default function Search({ query }) {
  const [rows, setRows] = useState([])
  const [tabs, setTabs] = useState([])
  const [selectTag, setSelectTag] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [loadingScroll, setLoadingScroll] = useState(false)
  const isLoadTag = useRef(true)
  const pageNum = useRef(0)
  const maxCount = useRef(50)

  async function fetch(isNew, tabId) {
    // debugger
    setLoading(true)
    try {
      pageNum.current = pageNum.current + 1
      let block_id = tabId === -1 ? undefined : tabId
      const { data } = await axios.get("/api/search", {
        params: { search: query.q, block_id, page_num: pageNum.current, page_size: 24 }
      })
      maxCount.current = data?.count
      const __rows = isNew ? [] : rows
      setRows([...__rows, ...data?.data])

      if (isLoadTag.current) {
        const list = [{ id: -1, name: "Tất cả" }]
        setTabs(data?.tabs?.length > 0 ? [...list, ...data?.tabs] : [])
        isLoadTag.current = false
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setLoadingScroll(false)
    }
  }

  function onChangeTab(tabId) {
    setSelectTag(tabId)
    pageNum.current = 0
    fetch(true, tabId)
  }

  useEffect(() => {
    if (loadingScroll && maxCount.current > rows.length) fetch(false, selectTag)
  }, [loadingScroll])

  useEffect(() => {
    // if (query?.q) {
    isLoadTag.current = true
    pageNum.current = 0
    setSelectTag(-1)
    fetch(true, -1)
    // }
  }, [query])

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + window.innerHeight > (document.body.scrollHeight * 6) / 7) {
        if (!calling) {
          setLoadingScroll(true)
        }
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className="p-10 2xl:p-12 text-dark-300 h-screen">
      <div className="mb-8 space-x-4 space-y-4">
        {loading && isLoadTag.current ? (
          <Fragment>
            {init.map((item) => {
              return <button key={item} className="rounded-full bg-dark-300 text-dark-100 py-1 px-4 h-8 w-32" />
            })}
          </Fragment>
        ) : (
          <Fragment>
            {tabs?.length > 0 &&
              tabs.map(({ id, name }) => {
                const __class = selectTag === id ? "bg-primary-900" : "bg-dark-500"
                return (
                  <button
                    onClick={() => onChangeTab(id)}
                    className={cn("rounded-full text-dark-100 py-1 px-4", __class)}
                    key={id}
                  >
                    {name}
                  </button>
                )
              })}
          </Fragment>
        )}
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium">Kết quả tìm kiếm</h2>
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
          {rows?.length > 0 &&
            rows?.map((item) => {
              return (
                <div key={item.id}>
                  <CardVod {...item} />
                </div>
              )
            })}
        </div>
      </div>
      <div>
        {!rows?.length && !loading && (
          <div className="text-center p-8 text-base">
            <div>
              <div> {ImgSearch}</div>
              <div>Không có kết quả tìm kiếm</div>
              <div>Hãy thử tìm kiếm với từ khóa khác</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Search.Layout = Layout

export async function getServerSideProps({ query }) {
  return { props: { query } }
}

const ImgSearch = (
  <svg width="" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 29.3333C10 18.6558 18.6558 10 29.3333 10C40.0108 10 48.6667 18.6558 48.6667 29.3333C48.6667 34.5618 46.5912 39.3056 43.2191 42.7856C43.1376 42.8454 43.0596 42.9121 42.9859 42.9859C42.9121 43.0596 42.8454 43.1376 42.7856 43.2191C39.3056 46.5912 34.5618 48.6667 29.3333 48.6667C18.6558 48.6667 10 40.0108 10 29.3333ZM44.3579 47.1864C40.2986 50.6061 35.0566 52.6667 29.3333 52.6667C16.4467 52.6667 6 42.22 6 29.3333C6 16.4467 16.4467 6 29.3333 6C42.22 6 52.6667 16.4467 52.6667 29.3333C52.6667 35.0566 50.6061 40.2986 47.1864 44.3579L57.4143 54.5858C58.1953 55.3669 58.1953 56.6332 57.4143 57.4143C56.6332 58.1953 55.3669 58.1953 54.5858 57.4143L44.3579 47.1864Z"
      fill="white"
      fillOpacity="0.87"
    />
  </svg>
)
