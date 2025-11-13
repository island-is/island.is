import { InputType } from '@nestjs/graphql'
import { SearchListInput } from './searchList.input'

@InputType('IcelandicGovernmentInstitutionsInvoiceTypesInput')
export class InvoiceTypesInput extends SearchListInput {}
