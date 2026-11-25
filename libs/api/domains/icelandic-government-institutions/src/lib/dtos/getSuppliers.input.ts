import { InputType } from '@nestjs/graphql'
import { SearchListInput } from './searchList.input'

@InputType('IcelandicGovernmentInstitutionsSuppliersInput')
export class SuppliersInput extends SearchListInput {}
