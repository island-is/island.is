import { Field, ObjectType, ID } from '@nestjs/graphql'
import { RskCompanyLink } from './rskCompanyLink.model'
import { RskCompanyVat } from './rskCompanyVat.model'

@ObjectType()
export class RskCompanySearchItem {
  @Field(() => ID)
  nationalIdCompany?: string

  @Field(() => String)
  name?: string

  @Field(() => String)
  dateOfRegistration?: string

  @Field(() => String)
  status?: string

  @Field(() => [RskCompanyVat])
  vat?: RskCompanyVat[]

  @Field(() => String)
  lastUpdated?: string

  @Field(() => [RskCompanyLink])
  links?: RskCompanyLink[]
}
