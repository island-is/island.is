import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetContentfulAssetBlobInput {
  @Field({ nullable: false })
  @IsString()
  url: string

  @Field({ nullable: true })
  @IsString()
  type?: string
}
