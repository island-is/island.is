import { Field, ObjectType, ID } from '@nestjs/graphql'
import { RskCompanyAddress } from './rskCompanyAddress.model'
import { RskCompanyFormOfOperation } from './rskCompanyFormOfOperation.model'
import { RskCompanyLink } from './rskCompanyLink.model'
import { RskCompanyRelatedParty } from './rskCompanyRelatedParty.model'
import { RskCompanyVat } from './rskCompanyVat.model'

@ObjectType()
export class RskCompanyInfo {
  @Field(() => [RskCompanyFormOfOperation], { nullable: true })
  formOfOperation?: RskCompanyFormOfOperation[]

  @Field(() => [RskCompanyAddress], { nullable: true })
  address?: RskCompanyAddress[]

  @Field(() => [RskCompanyRelatedParty], { nullable: true })
  relatedParty?: RskCompanyRelatedParty[]

  @Field(() => [RskCompanyVat], { nullable: true })
  vat?: RskCompanyVat[]
}

@ObjectType()
export class RskCompany {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => Date)
  dateOfRegistration!: Date

  @Field(() => String)
  status!: string

  @Field(() => String)
  vatNumber?: string

  @Field(() => Date)
  lastUpdated?: Date

  @Field(() => RskCompanyInfo, { nullable: true })
  companyInfo?: RskCompanyInfo
}
