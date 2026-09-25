import { InputType } from '@nestjs/graphql'
import { SearchListInput } from './searchList.input'

@InputType('IcelandicGovernmentInstitutionsInvoicePaymentTypesInput')
export class InvoicePaymentTypesInput extends SearchListInput {}
