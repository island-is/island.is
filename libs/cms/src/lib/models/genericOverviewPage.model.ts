import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IGenericOverviewPage } from '../generated/contentfulTypes'
import { Html, mapHtml } from './html.model'
import { Menu, mapMenu } from './menu.model'
import { IntroLinkImage, mapIntroLinkImage } from './introLinkImage.model'

@ObjectType()
export class GenericOverviewPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  pageIdentifier!: string

  @CacheField(() => Html, { nullable: true })
  intro?: Html | null

  @CacheField(() => Menu)
  navigation!: Menu | null

  @CacheField(() => [IntroLinkImage])
  overviewLinks?: IntroLinkImage[]
}

export const mapGenericOverviewPage = ({
  sys,
  fields,
}: IGenericOverviewPage): GenericOverviewPage => ({
  id: sys.id,
  title: fields.title ?? '',
  pageIdentifier: fields.pageIdentifier ?? '',
  intro: (fields.intro && mapHtml(fields.intro, sys.id + ':intro')) ?? null,
  navigation: fields.navigation ? mapMenu(fields.navigation) : null,
  overviewLinks: (fields.overviewLinks ?? []).map(mapIntroLinkImage),
})
