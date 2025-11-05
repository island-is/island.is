import { EmployeeBasicResponseDto, InvoiceDto, OpenInvoicesDto } from '@island.is/clients/elfur'
import { Employee } from '../models/employee.model'
import { InvoiceList } from '../models/invoiceList.model'

export const mapInvoiceList = (
  data: OpenInvoicesDto,
): InvoiceList => {

  //const invoiceGroups = data.invoices

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: []
  }
}
