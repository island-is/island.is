import { Field, InputType } from '@nestjs/graphql'

@InputType('UniversityGatewayGetPogramInput')
export class UniversityGatewayGetPogramInput {
  @Field()
  id!: string
}
