import { Field, Int, ObjectType } from '@nestjs/graphql'
import JSON from 'graphql-type-json'

@ObjectType()
export class VehiclesMileageUpdateError {
  @Field()
  message!: string

  @Field(() => Int, { nullable: true })
  code?: number

  @Field(() => JSON, { nullable: true })
  error?: string
}
