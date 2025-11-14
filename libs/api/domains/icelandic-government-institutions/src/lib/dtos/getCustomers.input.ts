import { InputType } from '@nestjs/graphql'
import { SearchListInput } from './searchList.input'

@InputType('IcelandicGovernmentInstitutionsCustomersInput')
export class CustomersInput extends SearchListInput {}
