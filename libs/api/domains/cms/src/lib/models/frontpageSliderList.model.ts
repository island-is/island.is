import { Field, ObjectType } from '@nestjs/graphql'
import { FrontpageSlide } from './frontpageSlide.model'

@ObjectType()
export class FrontpageSliderList {
  @Field(() => [FrontpageSlide])
  items: FrontpageSlide[]
}
