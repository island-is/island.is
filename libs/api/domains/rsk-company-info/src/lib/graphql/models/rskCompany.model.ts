import { Field, ObjectType, ID } from '@nestjs/graphql'
import { RskCompanyAddress } from './rskCompanyAddress.model'
import { RskCompanyFormOfOperation } from './rskCompanyFormOfOperation.model'
import { RskCompanyRelatedParty } from './rskCompanyRelatedParty.model'
import { RskCompanyVat } from './rskCompanyVat.model'

@ObjectType()
export class RskCompanyInfo {
  @Field(() => [RskCompanyFormOfOperation], { defaultValue: [] })
  formOfOperation?: RskCompanyFormOfOperation[]

  @Field(() => [RskCompanyAddress], { defaultValue: [] })
  address?: RskCompanyAddress[]

  @Field(() => [RskCompanyRelatedParty], { defaultValue: [] })
  relatedParty?: RskCompanyRelatedParty[]

  @Field(() => [RskCompanyVat], { defaultValue: [] })
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

  @Field(() => Date, { nullable: true })
  lastUpdated?: Date

  @Field(() => RskCompanyInfo, { nullable: true })
  companyInfo?: RskCompanyInfo
}
