import { Field, ID, ObjectType } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'
import { NationalRegistryBasePerson } from './nationalRegistryBasePerson.model'

@ObjectType()
export class NationalRegistryLivingArrangements {
  @Field(() => ID)
  domicileId!: string

  @Field(() => String, { nullable: true })
  domicileIdLast1stOfDecember?: string | null

  @Field(() => String, { nullable: true })
  domicileIdPreviousIcelandResidence?: string | null

  @Field(() => [NationalRegistryBasePerson], {
    nullable: true,
  })
  domicileInhabitants?: Array<NationalRegistryBasePerson> | null

  @Field(() => NationalRegistryAddress, { nullable: true })
  residence?: NationalRegistryAddress | null

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress | null
}
