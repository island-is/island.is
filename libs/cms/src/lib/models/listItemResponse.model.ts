import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { ListPage, mapListPage } from './listPage.model'
import { IListItem } from '../generated/contentfulTypes'

@ObjectType()
export class ListItemResponse {
    @Field()
    // TODO: implement

}

