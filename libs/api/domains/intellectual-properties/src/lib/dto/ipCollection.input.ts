import { Allow, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('IntellectualPropertiesCollectionInput')
export class IntellectualPropertiesCollectionInput {
  @Allow()
  @Field()
  @IsString()
  locale!: string
}
