import { Suppliers } from '../models/suppliers.model'
import { Supplier } from '../models/supplier.model'
import { SuppliersDto } from '@island.is/clients/financial-management-authority'

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
    data: suppliers,
  }
}
