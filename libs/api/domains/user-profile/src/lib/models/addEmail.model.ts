import { Field, ObjectType } from '@nestjs/graphql'
import { DataStatus } from '../types/dataStatus.enum'

@ObjectType()
export class AddEmail {
  @Field(() => String)
  id!: string

  @Field(() => String)
  email!: string

  @Field(() => DataStatus)
  emailStatus!: DataStatus

  @Field(() => Boolean)
  primary!: boolean

  @Field(() => Boolean)
  isConnectedToActorProfile!: boolean
}
