import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ITabSection } from '../generated/contentfulTypes'

import { TabContent, mapTabContent } from './tabContent.model'

@ObjectType()
export class TabSection {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  title?: string

  @Field(() => [TabContent])
  tabs?: Array<TabContent>
}

export const mapTabSection = ({ fields, sys }: ITabSection): TabSection => ({
  id: sys.id,
  title: fields.title ?? '',
  tabs: (fields.tabs ?? []).map(mapTabContent),
})
