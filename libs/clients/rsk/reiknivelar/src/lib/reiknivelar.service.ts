import { Injectable } from '@nestjs/common'
import {
  getApiBarnabaetur,
  getApiBifreidagjold,
  getApiBifreidahlunnindi,
  getApiFyrningOkutaekja,
  getApiStadgreidsla,
  getApiVaxtabaetur,
} from '../../gen/fetch'
import type {
  GetApiBarnabaeturData,
  GetApiBifreidagjoldData,
  GetApiBifreidahlunnindiData,
  GetApiFyrningOkutaekjaData,
  GetApiStadgreidslaData,
  GetApiVaxtabaeturData,
} from '../../gen/fetch'

@Injectable()
export class ReiknivelarClientService {
  async getBarnabaetur(query: GetApiBarnabaeturData['query']) {
    const { data } = await getApiBarnabaetur({ query })
    return data
  }

  async getBifreidagjold(query: GetApiBifreidagjoldData['query']) {
    const { data } = await getApiBifreidagjold({ query })
    return data
  }

  async getBifreidahlunnindi(query: GetApiBifreidahlunnindiData['query']) {
    const { data } = await getApiBifreidahlunnindi({ query })
    return data
  }

  async getFyrningOkutaekja(query: GetApiFyrningOkutaekjaData['query']) {
    const { data } = await getApiFyrningOkutaekja({ query })
    return data
  }

  async getStadgreidsla(query?: GetApiStadgreidslaData['query']) {
    const { data } = await getApiStadgreidsla({ query })
    return data
  }

  async getVaxtabaetur(query: GetApiVaxtabaeturData['query']) {
    const { data } = await getApiVaxtabaetur({ query })
    return data
  }
}
