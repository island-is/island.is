import { Field, ObjectType } from '@nestjs/graphql'
import { IcelandicName as TIcelandicName } from '@island.is/icelandic-names-registry-types'

@ObjectType()
export class IcelandicName implements TIcelandicName {
  @Field()
  id!: number

  @Field()
  icelandicName!: string

  @Field({ nullable: true })
  type!: string | null

  @Field({ nullable: true })
  status!: string | null

  @Field({ nullable: true })
  visible!: boolean | null

  @Field({ nullable: true })
  description!: string | null

  @Field({ nullable: true })
  url!: string | null

  @Field({ nullable: true })
  created!: Date | null

  @Field({ nullable: true })
  modified!: Date | null
}
