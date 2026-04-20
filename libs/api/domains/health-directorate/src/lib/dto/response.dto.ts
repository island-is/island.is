import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateResponse')
export class HealthDirectorateResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  message?: string
}
