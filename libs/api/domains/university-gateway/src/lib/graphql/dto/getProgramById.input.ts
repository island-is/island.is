import { Field, InputType } from '@nestjs/graphql'

export
@InputType()
class GetProgramByIdInput {
  @Field()
  id!: string
}
