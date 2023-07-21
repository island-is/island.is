import {
  EinstaklingurDTOForsjaItem,
  EinstaklingurDTOLoghTengsl,
} from '@island.is/clients/national-registry-v3'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryCustodian {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  custodyCode?: string | null

  @Field(() => String, { nullable: true })
  custodyText?: string | null

  @Field(() => Boolean, { nullable: true })
  livesWithChild?: boolean | null
}
