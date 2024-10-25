import { Field, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class VehiclesMileageUpdateError {
  @Field()
  message!: string

  @Field(() => Int, { nullable: true })
  code?: number

  @Field(() => GraphQLJSON, { nullable: true })
  error?: string
}
