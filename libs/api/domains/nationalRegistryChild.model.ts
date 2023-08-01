import { Field, ObjectType } from '@nestjs/graphql'
import { NationalRegistryBasePerson } from './nationalRegistryBasePerson.model'
import { NationalRegistryCustodian } from './nationalRegistryCustodian.model'
import { NationalRegistryPersonDetailsBase } from './nationalRegistryPerson.model'

@ObjectType('NationalRegistryChild')
export class NationalRegistryChild extends NationalRegistryPersonDetailsBase {
  @Field(() => [NationalRegistryCustodian], { nullable: true })
  custodians?: Array<NationalRegistryCustodian> | null

  @Field(() => [NationalRegistryBasePerson], { nullable: true })
  birthParents?: Array<NationalRegistryBasePerson> | null
}
