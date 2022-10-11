import getInstanceAxios from "../request"
const baseDomain = process.env.NEXT_PUBLIC_LIVE_SCORE
const baseURL = `${baseDomain}/`

export default getInstanceAxios(baseURL, true)
