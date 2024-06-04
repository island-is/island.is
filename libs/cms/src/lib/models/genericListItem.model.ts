import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { GenericList, mapGenericList } from './genericList.model'
import { IGenericListItem } from '../generated/contentfulTypes'

@ObjectType()
export class GenericListItem {
  @Field(() => ID)
  id!: string

  @CacheField(() => GenericList, { nullable: true })
  genericList?: GenericList

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  date?: string | null

  @CacheField(() => [SliceUnion])
  cardIntro: Array<typeof SliceUnion> = []

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field(() => String, { nullable: true })
  slug?: string
}

export const mapGenericListItem = ({
  fields,
  sys,
}: IGenericListItem): GenericListItem => ({
  id: sys.id,
  genericList: fields.genericList
    ? mapGenericList(fields.genericList)
    : undefined,
  title: fields.title ?? '',
  date: fields.date || null,
  cardIntro: fields.cardIntro
    ? mapDocument(fields.cardIntro, `${sys.id}:cardIntro`)
    : [],
  content: fields.content
    ? mapDocument(fields.content, `${sys.id}:content`)
    : [],
  slug: fields.slug,
})
