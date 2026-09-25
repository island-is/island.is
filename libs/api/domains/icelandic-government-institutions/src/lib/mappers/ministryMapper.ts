import { MinistriesDto } from '@island.is/clients/government-invoices'
import { MinistryCollection } from '../models/ministries.model'
import { Ministry } from '../models/ministry.model'

export const mapMinistries = (data: MinistriesDto): MinistryCollection => {
  const ministries: Ministry[] = data.ministries.map((ministry) => ({
    id: ministry.code,
    name: ministry.name,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: ministries,
  }
}
