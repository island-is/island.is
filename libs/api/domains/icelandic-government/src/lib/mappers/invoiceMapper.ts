import { OpenInvoicesDto } from '@island.is/clients/financial-management-authority'
import { Invoices } from '../models/invoices.model'
import { InvoiceGroup } from '../models/invoiceGroup.model'
import { Invoice } from '../models/invoice.model'
import { Entity } from '../models/entity.model'
import { generateMockItemization } from '../mocks/INVOICE_ITEMS'

export const mapInvoices = (data: OpenInvoicesDto): Invoices => {
  // Group invoices by buyer-seller relationship
  const groupedInvoices = new Map<
    string,
    {
      seller: Entity
      buyer: Entity
      invoices: Invoice[]
      totalAmount: number
    }
  >()

  data.invoices?.forEach((invoice) => {
    const groupKey = invoice.groupId

    if (!groupedInvoices.has(groupKey)) {
      groupedInvoices.set(groupKey, {
        seller: {
          id: invoice.supplierId,
          name: invoice.supplierName,
          // legalId: invoice.supplierNationalid,
        },
        buyer: {
          id: invoice.customerId,
          name: invoice.customerName,
          //legalId: invoice.customerNationalId,
        },
        invoices: [],
        totalAmount: 0,
      })
    }

    const group = groupedInvoices.get(groupKey)
    if (!group) return

    group.invoices.push({
      id: invoice.id,
      date: invoice.date.toISOString(),
      itemization: generateMockItemization(invoice.id, invoice.amount),
      totalItemizationAmount: invoice.amount,
    })
    group.totalAmount += invoice.amount
  })

  const invoiceGroups: InvoiceGroup[] = Array.from(
    groupedInvoices.entries(),
  ).map(([key, group]) => ({
    id: key,
    supplier: group.seller,
    customer: group.buyer,
    totalAmount: group.totalAmount,
    invoices: group.invoices,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: invoiceGroups,
  }
}
