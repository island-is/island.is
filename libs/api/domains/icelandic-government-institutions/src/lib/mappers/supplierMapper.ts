import { SuppliersDto } from '@island.is/clients/elfur'
import { Suppliers } from '../models/suppliers.model'
import { Supplier } from '../models/supplier.model'

export const mapSuppliers = (data: SuppliersDto): Suppliers => {
  const suppliers: Supplier[] = data.suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
    isConfidential: supplier.isConfidential,
    isPrivateProxy: supplier.isPrivateProxy,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: suppliers.sort((a, b) => a.name.localeCompare(b.name)),
  }
}
