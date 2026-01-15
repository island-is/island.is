import { SuppliersDto } from '@island.is/clients/financial-management-authority'
import { Suppliers } from '../models/suppliers.model'
import { Entity } from '../models/entity.model'

export const mapSuppliers = (data: SuppliersDto): Suppliers => {
  const suppliers: Entity[] = data.suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
    //legalId: supplier.legalId,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: suppliers,
  }
}
