import { Field, ObjectType } from '@nestjs/graphql'
import { Payload } from './payload.model'

@ObjectType('LicensesData')
export class Data {
  @Field({ description: 'Display name of license', nullable: true })
  name?: string

  @Field({ description: 'License number', nullable: true })
  number?: string

  @Field({ description: 'License number prefix', nullable: true })
  numberPrefix?: string

  @Field()
  expired!: boolean

  @Field()
  expiryTagText!: string

  @Field(() => Payload, { description: 'License display data', nullable: true })
  payload?: Payload
}
