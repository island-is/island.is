import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IListPage } from '../generated/contentfulTypes'

@ObjectType()
export class ListPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  relativeUrl!: string // TODO think this naming through
}

export const mapListPage = ({ fields, sys }: IListPage): ListPage => ({
  id: sys.id,
  title: fields.title ?? '',
  relativeUrl: fields.relativeUrl ?? '',
})
