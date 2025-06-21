import { Field, ObjectType } from '@nestjs/graphql'
import { DataStatus } from '../types/dataStatus.enum'

@ObjectType('ActorProfileEmail')
export class ActorProfileEmail {
  @Field(() => String)
  emailsId!: string

  @Field(() => String, { nullable: true })
  email!: string | null

  @Field(() => DataStatus)
  emailStatus!: DataStatus

  @Field(() => Boolean, { nullable: true })
  needsNudge!: boolean | null

  @Field(() => String)
  nationalId!: string

  @Field(() => Boolean)
  emailNotifications!: boolean
}
