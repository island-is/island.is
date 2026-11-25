import { InputType } from '@nestjs/graphql'
import { SearchListInput } from './searchList.input'

@InputType('IcelandicGovernmentInstitutionsDebtorsInput')
export class DebtorsInput extends SearchListInput {}
