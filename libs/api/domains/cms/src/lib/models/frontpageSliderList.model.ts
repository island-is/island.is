import { Field, ObjectType } from '@nestjs/graphql'

import { IFrontpageSliderList } from '../generated/contentfulTypes'

import { FrontpageSlide, mapFrontpageSlide } from './frontpageSlide.model'

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
