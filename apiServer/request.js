/* eslint-disable no-undef */
import axios from "axios"
const http = require("http")
const https = require("https")

const baseDomain = process.env.NEXT_PUBLIC_TV
const baseURL = `${baseDomain}/`

const instance = axios.create({
  baseURL: baseURL,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
})
instance.defaults.timeout = 3000
instance.interceptors.response.use(
  function (response) {
    try {
      if (response.status >= 200 && response.status < 300) return response.data
      return Promise.reject(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async function (error) {
    if (error.response) {
      const { response } = error
      const data = response.data
      if (data.message && response.config.method !== "get") {
        notification.error({
          message: data.message || "Network Error "
        })
      }
    }
    return Promise.reject(error)
  }
)

export default function getInstanceAxios(token, isKey) {
  instance.interceptors.request.use(
    function (config) {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
      if (!isKey) config.headers["x-api-key"] = "162C7D559DE4DD383DFD9867A456D8AA"
      if (token) config.headers.authorization = `Bearer ${token}`
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  // createAuthRefreshInterceptor(instance, refreshAuthLogic)
  return instance
}
