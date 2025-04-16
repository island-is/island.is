import { ObjectType, Field, Directive } from '@nestjs/graphql'

@ObjectType('WorkMachinesTechInfoItem')
export class TechInfoItem {
  @Field()
  name!: string

  @Field({ nullable: true })
  label?: string

  @Field({
    nullable: true,
    deprecationReason: 'Use localized label instead',
  })
  labelEn?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  required?: boolean

  @Field({ nullable: true })
  maxLength?: string

  @Field(() => [String], { nullable: true })
  itemValues?: Array<string>

  @Field(() => [TechInfoListItem], {
    nullable: true,
    deprecationReason: 'Use localized itemValues instead',
  })
  values?: Array<TechInfoListItem>
}

@Directive('@deprecated(reason: "Up for removal")')
@ObjectType('WorkMachinesTechInfoListItem')
export class TechInfoListItem {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nameEn?: string
}
