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

  @Field()
  date!: string

  @CacheField(() => [SliceUnion])
  cardIntro: Array<typeof SliceUnion> = []
}

export const mapGenericListItem = ({
  fields,
  sys,
}: IGenericListItem): GenericListItem => {
  return {
    id: sys.id,
    genericList: fields.genericList
      ? mapGenericList(fields.genericList)
      : undefined,
    title: fields.title ?? '',
    date: fields.date ?? '',
    cardIntro: fields.cardIntro
      ? mapDocument(fields.cardIntro, sys.id + ':cardIntro')
      : [],
  }
}
