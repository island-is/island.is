import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum ActionTypeEnum {
  file = 'file',
  url = 'url',
  inbox = 'inbox',
}
registerEnumType(ActionTypeEnum, {
  name: 'LawAndOrderActionTypeEnum',
})

@ObjectType('LawAndOrderAction')
export class Action {
  @Field(() => ActionTypeEnum, { nullable: true })
  type?: ActionTypeEnum

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  data?: string
}
