import { RegName } from '@island.is/regulations'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DraftRegulationCancelModel {
  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  name?: RegName

  @Field(() => String, { nullable: true })
  regTitle?: string

  @Field(() => String, { nullable: true })
  date!: string

  @Field(() => Boolean, { nullable: true })
  dropped?: boolean
}
