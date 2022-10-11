import getInstanceAxios from "../request"
const baseDomain = process.env.NEXT_PUBLIC_DOMAIN_AUTH
const baseURL = `${baseDomain}/`

export default getInstanceAxios(baseURL)
