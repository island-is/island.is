import { UNIVERSITY_GATEWAY_BASE_URL } from '@island.is/web/constants'
import axios from 'axios'

export const getPrograms = async (): Promise<any | null> => {
  const api = `${UNIVERSITY_GATEWAY_BASE_URL}`
  let response

  try {
    response = await axios.get(`${api}/programs`)
  } catch (e) {
    const errMsg = 'Failed to retrieve program'
    const description = e.response.data.description

    //   this.logger.error(errMsg, {
    //     message: description,
    //   })

    throw new Error(`${errMsg}: ${description}`)
  }

  if (response.data.results.length > 0) {
    console.log('response', response.data.results)
    return response.data.results[0]
  }

  return null
}
