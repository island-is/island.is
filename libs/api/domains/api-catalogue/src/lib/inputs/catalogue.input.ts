import { Field, InputType, ID } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class ApiCatalogueInput {
  @Field(() => ID)
  @IsString()
  id: string
}
