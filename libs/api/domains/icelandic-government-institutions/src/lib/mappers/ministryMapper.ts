import { MinistriesDto } from '@island.is/clients/government-invoices'
import { Ministries } from '../models/ministries.model'
import { Ministry } from '../models/ministry.model'

export const mapMinistries = (data: MinistriesDto): Ministries => {
  const ministries: Ministry[] = data.ministries.map((ministry) => ({
    code: ministry.code,
    name: ministry.name,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: ministries.sort((a, b) => a.name.localeCompare(b.name)),
  }
}
