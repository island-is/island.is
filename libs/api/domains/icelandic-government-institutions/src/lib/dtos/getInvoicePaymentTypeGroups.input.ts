import { InputType } from '@nestjs/graphql'
import { SearchListInput } from './searchList.input'

@InputType('IcelandicGovernmentInstitutionsInvoicePaymentTypeGroupsInput')
export class InvoicePaymentTypeGroupsInput extends SearchListInput {}
