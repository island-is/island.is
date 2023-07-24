import { Field, ID, ObjectType } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryResidenceInfo {
  @Field(() => ID)
  domicileId!: string

  @Field(() => String, { nullable: true })
  domicileIdLast1stOfDecember?: string | null

  @Field(() => String, { nullable: true })
  domicileIdPreviousIcelandResidence?: string | null

  @Field(() => NationalRegistryAddress, { nullable: true })
  residence?: NationalRegistryAddress | null

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress | null
}
