import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SliceUnion } from '../unions/slice.union'
import { ListPage, mapListPage } from './listPage.model'
import { IListItem } from '../generated/contentfulTypes'

@ObjectType()
class ListItemCustomFields {
  @CacheField(() => [SliceUnion], { nullable: true })
  thumbnailContent?: Array<typeof SliceUnion> = []
}

@ObjectType()
export class ListItem {
  @Field(() => ID)
  id!: string

  @CacheField(() => ListPage)
  listPage!: ListPage

  @Field()
  title!: string

  @Field()
  date!: string

  @CacheField(() => ListItemCustomFields)
  customFields!: ListItemCustomFields
}

const mapListItemCustomFields = (
  listItemFields: IListItem['fields'],
): ListItemCustomFields => {
  return {
    thumbnailContent: [], // TODO: default set this to listpage.template field if (??)
  }
}

export const mapListItem = ({ fields, sys }: IListItem): ListItem => {
  return {
    id: sys.id,
    title: fields.title,
    listPage: mapListPage(fields.listPage),
    customFields: mapListItemCustomFields(fields),
    //fields.date
    date: '2024-01-01', // TODO: add field in cms
  }
}
