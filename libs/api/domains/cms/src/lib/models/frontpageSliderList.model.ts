import { Field, ObjectType } from '@nestjs/graphql'

import { IFrontpageSliderList } from '../generated/contentfulTypes'

import { FrontpageSlider, mapFrontpageSlider } from './frontpageSlider.model'

@ObjectType()
export class FrontpageSliderList {
  @Field(() => [FrontpageSlider])
  items: FrontpageSlider[]
}

export const mapFrontpageSliderList = ({
  fields,
}: IFrontpageSliderList): FrontpageSliderList => ({
  items: fields.items.map(mapFrontpageSlider),
})
