import axios from 'axios'

console.log('NEXT_PUBLIC_BACKEND_URL', process.env.NEXT_PUBLIC_BACKEND_URL)

const instance = axios.create({
  baseURL: '/backend',
  responseType: 'json',
})

export default instance
