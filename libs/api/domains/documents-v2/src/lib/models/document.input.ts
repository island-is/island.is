import { InputType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DocumentsV2DocumentInput')
export class DocumentInput {
  @Field()
  @IsString()
  readonly id!: string
}
