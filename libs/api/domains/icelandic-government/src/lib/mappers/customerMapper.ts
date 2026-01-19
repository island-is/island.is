import { CustomersDto } from '@island.is/clients/financial-management-authority'
import { Customers } from '../models/customers.model'
import { Customer } from '../models/customer.model'

export const mapCustomers = (data: CustomersDto): Customers => {
  const customers: Customer[] = data.customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: customers,
  }
}
