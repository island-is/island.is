import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { ITabSection } from '../generated/contentfulTypes'
import { TabContent, mapTabContent } from './tabContent.model'

@ObjectType()
export class TabSection {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @CacheField(() => [TabContent])
  tabs?: Array<TabContent>
}

export const mapTabSection = ({
  fields,
  sys,
}: ITabSection): SystemMetadata<TabSection> => ({
  typename: 'TabSection',
  id: sys.id,
  title: fields.title ?? '',
  tabs: (fields.tabs ?? []).map(mapTabContent),
})
