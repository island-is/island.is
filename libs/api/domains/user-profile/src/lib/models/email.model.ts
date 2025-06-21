import { Field, ObjectType } from '@nestjs/graphql'
import { DataStatus } from '../types/dataStatus.enum'

@ObjectType()
export class Email {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  email!: string | null

  @Field(() => Boolean)
  primary!: boolean

  @Field(() => DataStatus)
  emailStatus!: DataStatus

  @Field(() => Boolean)
  isConnectedToActorProfile!: boolean
}
