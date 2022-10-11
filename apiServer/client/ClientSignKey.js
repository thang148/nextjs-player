import getInstanceAxios from "../../api/request"
const baseDomain = process.env.NEXT_PUBLIC_DOMAIN_AUTH
const baseURL = `${baseDomain}/`

function instanceAxios(token, isKey) {
  return getInstanceAxios(baseURL, token, isKey)
}

export default instanceAxios
