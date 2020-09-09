import { Field, ObjectType } from '@nestjs/graphql'
import { FrontpageSlide, mapFrontpageSlide } from './frontpageSlide.model'
import { IFrontpageSliderList } from '../generated/contentfulTypes'

@ObjectType()
export class FrontpageSliderList {
  @Field(() => [FrontpageSlide])
  items: FrontpageSlide[]
}

export const mapFrontpageSliderList = ({
  fields,
}: IFrontpageSliderList): FrontpageSliderList => ({
  items: fields.items.map(mapFrontpageSlide),
})
