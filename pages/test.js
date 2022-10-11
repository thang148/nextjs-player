import axios from "axios"
import { useEffect } from "react"
export default function Index({ time }) {
  async function fetch() {
    try {
      const { data } = await axios.get("/api/hello", {
        params: {
          id: "983f1319-3cc5-448a-9ffa-5ca5367d292f",
          type: 2,
          page_num: 1,
          page_size: 10
        }
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <main>
      <h1>SSR Caching with Next.js</h1>
      <time dateTime={time}>{time}</time>
    </main>
  )
}

export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")
  console.log("xcxcxxcxx")

  return {
    props: {
      time: new Date().toISOString()
    }
  }
}
