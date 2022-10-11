import Cookies from "js-cookie"

// const configDomain = {
//   domain: process.env.NEXT_PUBLIC_DOMAIN_COOKIES
// }
const configDomain = {}
export function getInfo() {
  const item = Cookies.get("userInfo", configDomain)
  if (item) {
    return JSON.parse(item)
  }
  return false
}
export function getSignKey() {
  const item = Cookies.get("sign_key", configDomain)
  if (item && getAccessToken()) return item
  return false
}

export function saveSignKey(signKey) {
  Cookies.set("sign_key", signKey, { expires: 1, domain: process.env.NEXT_PUBLIC_DOMAIN_COOKIES })
}

export function setInfo(item) {
  if (item) {
    Cookies.set("userInfo", JSON.stringify(item), configDomain)
  } else {
    console.log("userInfo is null")
  }
}

export function removeToken() {
  Cookies.remove("accessToken", configDomain)
  Cookies.remove("refreshToken", configDomain)
  Cookies.remove("userInfo", configDomain)
  Cookies.remove("sign_key", configDomain)
}

export function getAccessToken() {
  const item = Cookies.get("accessToken", configDomain)
  if (item) {
    return item
  }
  return false
}

export function getRefreshToken() {
  const item = Cookies.get("refreshToken", configDomain)
  if (item) {
    return item
  }
  return false
}

export function setAccessToken(accessToken) {
  Cookies.set("accessToken", accessToken, configDomain)
}

export function setRefreshToken(refreshToken) {
  Cookies.set("refreshToken", refreshToken, configDomain)
}

export function saveVolumn(value) {
  Cookies.set("volumn", value, configDomain)
}

export function getVolumn() {
  const item = Cookies.get("volumn", configDomain)
  if (item) {
    return Number(item)
  }
  return 0.8
}
