import appConfig from '@renderer/configs/app.config'
import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from '@renderer/constants/api.constant'
import { PERSIST_STORE_NAME } from '@renderer/constants/app.constant'
import deepParseJson from '@renderer/utils/deepParseJson'
import axios from 'axios'
import store, { signOutSuccess } from '../store'

const unauthorizedCode = [401]

const BaseService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefix
})

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)

    let accessToken = (persistData as any).auth.session.token
    if (!accessToken) {
      const { auth } = store.getState()
      accessToken = auth.session.token
    }

    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

BaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    if (response && unauthorizedCode.includes(response.status)) {
      store.dispatch(signOutSuccess())
    }

    return Promise.reject(error)
  }
)

export default BaseService
