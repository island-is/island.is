import axios from 'axios'

const identityServer = axios.create({
  baseURL: '/identity-server',
  responseType: 'json',
})

export default identityServer
