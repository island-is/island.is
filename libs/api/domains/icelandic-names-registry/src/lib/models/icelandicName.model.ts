import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IcelandicName {
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
}
