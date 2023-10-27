import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UniversityGatewayProgramFilter')
export class UniversityGatewayProgramFilter {
  @Field()
  field!: string

  @Field(() => [String])
  options!: string[]
}
