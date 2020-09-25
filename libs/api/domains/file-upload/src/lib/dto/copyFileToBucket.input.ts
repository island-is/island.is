import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CopyFileToBucketInput {
  @Field()
  @IsString()
  key!: string

  @Field()
  @IsString()
  bucket!: string
}
