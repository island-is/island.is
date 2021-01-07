import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IGenericOverviewPage } from '../generated/contentfulTypes'
import { Html, mapHtml } from './html.model'
import { Menu, mapMenu } from './menu.model'

@ObjectType()
export class GenericOverviewPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => Html, { nullable: true })
  intro: Html

  @Field(() => Menu)
  navigation: Menu
}

export const mapGenericOverviewPage = ({
  sys,
  fields,
}: IGenericOverviewPage): GenericOverviewPage => ({
  id: sys.id,
  title: fields.title ?? '',
  intro: (fields.intro && mapHtml(fields.intro, sys.id + ':intro')) ?? null,
  navigation: mapMenu(fields.navigation),
})
