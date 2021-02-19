import { Field, ObjectType } from '@nestjs/graphql'

import { ITestHomepage } from '../generated/contentfulTypes'

import { Featured, mapFeatured } from './featured.model'
import { FrontpageSlider, mapFrontpageSlider } from './frontpageSlider.model'
import { UiConfiguration, mapUiConfiguration } from './uiConfiguration.model'
import { LifeEventPage, mapLifeEventPage } from './lifeEventPage.model'

@ObjectType()
export class TestHomepage {
  @Field({ nullable: true })
  title?: string

  @Field(() => [Featured])
  featured?: Array<Featured>

  @Field(() => [FrontpageSlider])
  slides?: Array<FrontpageSlider>

  @Field(() => UiConfiguration, { nullable: true })
  namespace?: UiConfiguration

  @Field(() => [LifeEventPage])
  lifeEvents?: Array<LifeEventPage>
}

export const mapTestHomepage = ({ fields }: ITestHomepage): TestHomepage => ({
  title: fields.title ?? '',
  featured: (fields.featured ?? []).map(mapFeatured),
  slides: (fields.slides ?? []).map(mapFrontpageSlider),
  namespace: fields.namespace?.fields,
  lifeEvents: (fields.lifeEvents ?? []).map(mapLifeEventPage),
})
