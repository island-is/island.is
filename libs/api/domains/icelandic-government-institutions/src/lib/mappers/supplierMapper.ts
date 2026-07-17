import { SuppliersDto } from '@island.is/clients/government-invoices'
import { Suppliers } from '../models/suppliers.model'
import { Supplier } from '../models/supplier.model'

export const mapSuppliers = (data: SuppliersDto): Suppliers => {
  const suppliers: Supplier[] = data.suppliers.map((supplier) => ({
    id: supplier.legalId,
    name: supplier.name,
    isConfidential: supplier.isConfidential,
    isPrivatePerson: supplier.isPrivatePerson,
    isPrivatePersonProxy: supplier.isPrivatePersonProxy,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: suppliers,
  }
}
