import { Allow, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('IntellectualPropertiesDesignImagesInput')
export class IntellectualPropertiesDesignImagesInput {
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
