import Client from "../client/Auth"
import ClientSignKey from "../client/ClientSignKey"
const resource = "/api"

const login = (data) => Client.post(`${resource}/login`, data)
const logOut = (data) => Client.post(`${resource}/logout`, data)
const register = (data) => Client.post(`${resource}/users`, data)

function signInBySocial(data) {
  return Client.post(`api/login`, data)
}
const getMe = () => {
  return Client.get(`api/my`)
}
const updateProfile = (id, data) => {
  return Client.put(`api/users/${id}`, data)
}

const refreshToken = (data) => {
  return Client.post(`authentications/refresh/`, data)
}
const forgotPassword = (data, params) => {
  return Client.post(`auth/forgot-password`, data, { params })
}

const sendOtp = (data) => {
  return Client.post(`api/verify_otp`, data)
}
const verifyOtp = (params) => {
  return Client.get(`api/verify_otp`, { params })
}
const checkPhoneExist = (params) => {
  return Client.get(`api/phone`, { params })
}

const setPassword = (id, data) => {
  return Client.put(`api/users/${id}`, data)
}

const getKey = () => {
  return ClientSignKey.get(`/api/sign_key`)
}

const createQrCode = (data) => {
  return Client.post(`/api/smart_tv/code`, data)
}

const createToken = (data) => {
  return Client.post(`/api/smart_tv/token`, data)
}
const updatePhone = (data) => {
  return Client.post(`${resource}/link_account`, data)
}
const userRepository = {
  login,
  logOut,
  register,
  getMe,
  refreshToken,
  forgotPassword,
  setPassword,
  signInBySocial,
  updateProfile,
  sendOtp,
  verifyOtp,
  checkPhoneExist,
  getKey,
  createQrCode,
  createToken,
  updatePhone
}
export default userRepository
