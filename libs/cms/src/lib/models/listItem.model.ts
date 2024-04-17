import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { ListPage, mapListPage } from './listPage.model'
import { IListItem } from '../generated/contentfulTypes'

@ObjectType()
export class ListItem {
  @Field(() => ID)
  id!: string

  @CacheField(() => ListPage)
  listPage!: ListPage

  @Field()
  title!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  thumbnailContent?: Array<typeof SliceUnion> = []

  @Field({ nullable: true })
  slug?: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion> = []
}

export const mapListItem = ({ fields, sys }: IListItem): ListItem => {
  return {
    id: sys.id,
    title: fields.title,
    listPage: mapListPage(fields.listPage),
    thumbnailContent: fields.thumbnailContent
      ? mapDocument(fields.thumbnailContent, sys.id + ':thumbnailContent')
      : [],
  }
}
