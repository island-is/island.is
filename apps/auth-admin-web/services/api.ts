import axios from 'axios'

const instance = axios.create({
  baseURL: '/backend',
  responseType: 'json',
})

export default instance
