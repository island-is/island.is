import { Field, ObjectType } from '@nestjs/graphql'
import { ITestHomepage } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'
import { FrontpageSlider, mapFrontpageSlider } from './frontpageSlider.model'
import { LifeEventPage, mapLifeEventPage } from './lifeEventPage.model'
import { mapNamespace, Namespace } from './namespace.model'

@ObjectType()
export class TestHomepage {
  @Field({ nullable: true })
  title?: string

  @Field(() => [Featured])
  featured?: Array<Featured>

  @Field(() => [FrontpageSlider])
  slides?: Array<FrontpageSlider>

  @Field(() => Namespace, { nullable: true })
  namespace?: Namespace

  @Field(() => [LifeEventPage])
  lifeEvents?: Array<LifeEventPage>
}

export const mapTestHomepage = ({ fields }: ITestHomepage): TestHomepage => ({
  title: fields.title ?? '',
  featured: (fields.featured ?? []).map(mapFeatured),
  slides: (fields.slides ?? []).map(mapFrontpageSlider),
  namespace: fields.namespace ? mapNamespace(fields.namespace) : null,
  lifeEvents: (fields.lifeEvents ?? []).map(mapLifeEventPage),
})
