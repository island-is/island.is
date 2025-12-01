import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Action } from './actions.model'

export enum ItemType {
  RichText = 'richText',
  Accordion = 'accordion',
  Text = 'text',
  RadioButton = 'radioButton',
}

registerEnumType(ItemType, {
  name: 'LawAndOrderItemType',
})

export enum LinkType {
  Email = 'email',
  Tel = 'tel',
}

registerEnumType(LinkType, {
  name: 'LawAndOrderLinkType',
})
@ObjectType('LawAndOrderSubpoenaItem')
export class Item {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  link?: string

  @Field(() => LinkType, { nullable: true })
  linkType?: LinkType

  @Field(() => ItemType, { nullable: true })
  type?: ItemType

  @Field(() => Action, { nullable: true })
  action?: Action
}
