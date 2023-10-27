import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UniversityGatewayGetProgramByIdInput {
  @Field()
  id!: string
}
