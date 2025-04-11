import { ObjectType, Field, Directive } from '@nestjs/graphql'

@Directive('@deprecated(reason: "Up for removal")')
@ObjectType('WorkMachinesTechInfoItem')
export class TechInfoItem {
  @Field(() => String, { nullable: true })
  variableName?: string | null

  @Field(() => String, { nullable: true })
  label?: string | null

  @Field(() => String, { nullable: true })
  labelEn?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => Boolean, { nullable: true })
  required?: boolean | null

  @Field(() => String, { nullable: true })
  maxLength?: string | null

  @Field(() => [TechInfoListItem], { nullable: true })
  values?: Array<TechInfoListItem> | null
}

@Directive('@deprecated(reason: "Up for removal")')
@ObjectType('WorkMachinesTechInfoListItem')
export class TechInfoListItem {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  nameEn?: string | null
}
