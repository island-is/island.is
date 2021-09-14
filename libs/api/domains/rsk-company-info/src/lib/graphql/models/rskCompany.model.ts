import { Field, ObjectType, ID } from '@nestjs/graphql'
import { RskCompanyAddress } from './rskCompanyAddress.model'
import { RskCompanyFormOfOperation } from './rskCompanyFormOfOperation.model'
import { RskCompanyLink } from './rskCompanyLink.model'
import { RskCompanyRelatedParty } from './rskCompanyRelatedParty.model'
import { RskCompanyVat } from './rskCompanyVat.model'

@ObjectType()
export class RskCompany {
  @Field(() => ID)
  nationalIdCompany!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  dateOfRegistration!: string

  @Field(() => String)
  status!: string

  @Field(() => [RskCompanyFormOfOperation])
  formOfOperation?: RskCompanyFormOfOperation[]

  @Field(() => [RskCompanyVat])
  vat?: RskCompanyVat[]

  @Field(() => [RskCompanyAddress])
  address?: RskCompanyAddress[]

  @Field(() => [RskCompanyRelatedParty])
  relatedParty?: RskCompanyRelatedParty[]

  @Field(() => String)
  lastUpdated?: string

  @Field(() => [RskCompanyLink])
  link?: RskCompanyLink[]
}
