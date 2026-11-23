import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAppLogin')
export class AppLogin {
  @Field(() => ID)
  id!: string

  @Field()
  clientId!: string

  @Field(() => String, { nullable: true })
  clientName?: string | null

  @Field()
  platform!: string

  @Field(() => String, { nullable: true })
  deviceName?: string | null

  @Field()
  loginIdp!: string

  @Field()
  biometrics!: boolean

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  lastUsed!: Date
}
