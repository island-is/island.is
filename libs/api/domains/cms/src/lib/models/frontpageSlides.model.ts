import { Field, ObjectType } from '@nestjs/graphql'
import { FrontpageSlide } from './frontpageSlide.model'

@ObjectType()
export class FrontpageSlides {
  @Field(() => [FrontpageSlide])
  items: FrontpageSlide[]
}
