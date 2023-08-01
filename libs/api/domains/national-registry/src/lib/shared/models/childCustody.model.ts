import { Field, ObjectType } from '@nestjs/graphql'
import { PersonBase } from './personBase.model'
import { Custodian } from './custodian.model'

@ObjectType('NationalRegistryChildCustody')
export class ChildCustody extends PersonBase {
  @Field(() => [Custodian], { nullable: true })
  custodians?: Array<Custodian> | null

  @Field(() => [PersonBase], { nullable: true })
  birthParents?: Array<PersonBase> | null
}
