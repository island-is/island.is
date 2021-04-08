import { Field, ObjectType } from '@nestjs/graphql'
import { IcelandicName as TIcelandicName } from '@island.is/icelandic-names-registry-types'

@ObjectType()
export class IcelandicName implements TIcelandicName {
  @Field()
  id!: number

  @Field()
  icelandic_name!: string

  @Field({ nullable: true })
  type!: string

  @Field({ nullable: true })
  status!: string

  @Field({ nullable: true })
  visible!: boolean

  @Field({ nullable: true })
  description!: string

  @Field({ nullable: true })
  url!: string

  @Field({ nullable: true })
  created!: Date

  @Field({ nullable: true })
  modified!: Date
}
