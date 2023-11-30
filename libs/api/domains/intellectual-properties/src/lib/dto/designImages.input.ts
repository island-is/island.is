import { Allow, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('IntellectualPropertyDesignImagesInput')
export class IntellectualPropertyDesignImagesInput {
  @Allow()
  @Field()
  @IsString()
  designId!: string

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
