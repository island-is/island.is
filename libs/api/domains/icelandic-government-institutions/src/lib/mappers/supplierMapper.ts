import { SuppliersDto } from '@island.is/clients/government-invoices'
import { SupplierCollection } from '../models/suppliers.model'
import { Supplier } from '../models/supplier.model'

export const mapSuppliers = (data: SuppliersDto): SupplierCollection => {
  const suppliers: Supplier[] = data.suppliers.map((supplier) => ({
    id: supplier.legalId,
    name: supplier.name,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: suppliers,
  }
}
