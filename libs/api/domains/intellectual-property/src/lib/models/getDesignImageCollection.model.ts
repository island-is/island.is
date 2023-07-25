import { Field, ObjectType } from '@nestjs/graphql'
import { Image } from './getDesignImage.model'

@ObjectType('IntellectualPropertyDesignImageCollection')
export class DesignImageCollection {
  @Field(() => [Image], { nullable: true })
  images?: Array<Image> | null
}
