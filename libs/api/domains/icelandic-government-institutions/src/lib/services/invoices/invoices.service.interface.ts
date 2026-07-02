import { DebtorsInput } from '../../dtos/getDebtors.input'
import { InvoiceGroupInput } from '../../dtos/getInvoiceGroup.input'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoicePaymentTypesInput } from '../../dtos/getInvoicePaymentTypes.input'
import { MinistriesInput } from '../../dtos/getMinistries.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Debtors } from '../../models/debtors.model'
import { InvoiceGroup } from '../../models/invoiceGroup.model'
import { InvoiceGroupCollection } from '../../models/invoiceGroups.model'
import { InvoicePaymentTypes } from '../../models/invoicePaymentTypes.model'
import { Ministries } from '../../models/ministries.model'
import { Suppliers } from '../../models/suppliers.model'

export interface IInvoicesService {
  getOpenInvoicesGroup(input?: InvoiceGroupInput): Promise<InvoiceGroup | null>
  getOpenInvoiceGroups(
    input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroupCollection | null>
  getSuppliers(input?: SuppliersInput): Promise<Suppliers | null>
  getDebtors(input?: DebtorsInput): Promise<Debtors | null>
  getMinistries(input?: MinistriesInput): Promise<Ministries | null>
  getInvoicePaymentTypes(
    input?: InvoicePaymentTypesInput,
  ): Promise<InvoicePaymentTypes | null>
}
