import Client from "../client/ClientTV"
const resource = "/api/v2"

const getListForHome = (cookies, params) => {
  return Client(cookies).get(`${resource}/publish/events/`, { params })
}
const getFullByBlock = (cookies, eventId, params) => {
  return Client(cookies).get(`${resource}/publish/see-more/events/${eventId}/`, { params })
}
const getBanner = (cookies, params) => {
  return Client(cookies).get(`${resource}/publish/banner/`, { params })
}
const getEventOrVideo = (cookies, params) => {
  return Client(cookies).get(`${resource}/publish/event/`, { params })
}
const search = (cookies, params) => {
  return Client(cookies).get(`${resource}/publish/events/elastic-search/`, { params })
}
const getRelatedTo = (cookies, params) => {
  return Client(cookies).get(`${resource}/publish/event/related-to/`, { params })
}
const getSlides = (cookies) => {
  return Client(cookies).get(`${resource}/publish/slides/`)
}

const userRepository = {
  getEventOrVideo,
  getFullByBlock,
  getListForHome,
  search,
  getBanner,
  getRelatedTo,
  getSlides
}

export default userRepository
