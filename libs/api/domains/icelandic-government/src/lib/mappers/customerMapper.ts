import { CustomersDto } from '@island.is/clients/financial-management-authority'
import { Customers } from '../models/customers.model'
import { Entity } from '../models/entity.model'

export const mapCustomers = (data: CustomersDto): Customers => {
  const customers: Entity[] = data.customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    //legalId: customer.legalId,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: customers,
  }
}
