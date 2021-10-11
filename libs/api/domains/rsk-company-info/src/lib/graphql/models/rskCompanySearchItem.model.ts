import { Field, ObjectType, ID } from '@nestjs/graphql'
import { RskCompany } from './rskCompany.model'
import { RskCompanyLink } from './rskCompanyLink.model'
import { RskCompanyVat } from './rskCompanyVat.model'

@ObjectType()
export class RskCompanySearchItem {
  @Field(() => ID)
  nationalId?: string

  @Field(() => String)
  name?: string

  @Field(() => Date)
  dateOfRegistration?: Date

  @Field(() => String)
  status?: string

  @Field(() => [RskCompanyVat], { nullable: true })
  vat?: RskCompanyVat[]

  @Field(() => Date)
  lastUpdated?: Date

  @Field(() => RskCompany, { nullable: true })
  companyInfo?: RskCompany

  @Field(() => [RskCompanyLink])
  links?: RskCompanyLink[]
}
