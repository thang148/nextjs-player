import Client from "../client/LiveScoreClient"
const resource = "/api/v1"

const getLeagues = () => {
  return Client.get(`${resource}/publish/leagues/`)
}
const getLiveSocres = (params) => {
  return Client.get(`${resource}/internal/livecores/find/`, { params })
}
const getDetailSccore = (params) => {
  return Client.get(`${resource}/internal/match/progress`, { params })
}
const getInfo = (params) => {
  return Client.get(`${resource}/internal/match/info`, { params })
}
const getLink = (params) => {
  return Client.get(`${resource}/sortlink`, { params })
}
const getVideos = (params) => {
  return Client.get(`${resource}/videobymatchid`, { params })
}

const userRepository = {
  getLeagues,
  getLiveSocres,
  getDetailSccore,
  getInfo,
  getLink,
  getVideos
}
export default userRepository
