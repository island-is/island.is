import { RskCompany } from '../models/rskCompany.model'

export type PageResult = {
  hasNextPage: boolean
  items: RskCompany[]
}
