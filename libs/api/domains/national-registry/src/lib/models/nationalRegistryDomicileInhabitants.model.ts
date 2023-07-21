import { Field, ID, ObjectType } from '@nestjs/graphql'

import { NationalRegistryPerson } from './nationalRegistryPerson.model'

@ObjectType()
export class NationalRegistryDomicileInhabitants {
  @Field(() => ID)
  legalDomicileId!: string

  @Field(() => [NationalRegistryPerson], {
    nullable: true,
  })
  inhabitants?: Array<NationalRegistryPerson>
}
