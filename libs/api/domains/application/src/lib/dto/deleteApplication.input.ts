import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class DeleteApplicationInput {
  @Field((type) => String)
  @IsString()
  id!: string
}
