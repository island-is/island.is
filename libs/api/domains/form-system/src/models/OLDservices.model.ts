import { Field, ObjectType } from '@nestjs/graphql'
import { ListItem } from './OLDinputSettings.model'

@ObjectType('FormSystemList')
export class List {
  @Field(() => String, { nullable: true })
  listType?: string

  @Field(() => [ListItem], { nullable: 'itemsAndList' })
  listi?: ListItem[]
}
