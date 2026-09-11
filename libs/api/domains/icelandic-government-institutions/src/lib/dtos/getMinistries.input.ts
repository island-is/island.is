import { InputType } from '@nestjs/graphql'
import { SearchListInput } from './searchList.input'

@InputType('IcelandicGovernmentInstitutionsMinistriesInput')
export class MinistriesInput extends SearchListInput {}
