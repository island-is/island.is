import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GetApplePaySessionResponse {
  @Field(() => String, {
    description: 'Apple Pay session',
  })
  session!: string
}
