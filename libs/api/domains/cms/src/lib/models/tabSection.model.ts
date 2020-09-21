import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ITabSection } from '../generated/contentfulTypes'

import { TabContent, mapTabContent } from './tabContent.model'

@ObjectType()
export class TabSection {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [TabContent])
  tabs: Array<TabContent>
}

export const mapTabSection = ({ fields, sys }: ITabSection): TabSection => ({
  typename: 'TabSection',
  id: sys.id,
  title: fields?.title ?? '',
  tabs: (fields?.tabs ?? []).map(mapTabContent),
})
