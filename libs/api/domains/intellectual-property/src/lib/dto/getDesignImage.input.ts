import { Allow, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('IntellectualPropertyDesignImageInput')
export class GetIntellectualPropertyDesignImageInput {
  @Allow()
  @Field()
  @IsString()
  hId!: string

  @Allow()
  @Field()
  @IsString()
  designNumber!: string

  @Allow()
  @Field()
  @IsString()
  imageNumber!: string

  @Allow()
  @Field({ nullable: true })
  @IsString()
  size?: string
}
