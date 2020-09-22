import { Field, InputType, ID } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetApiCatalogueInput {
  @Field(() => ID)
  @IsString()
  id: string
}
