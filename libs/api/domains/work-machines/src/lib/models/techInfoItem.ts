import { ObjectType, Field } from '@nestjs/graphql'

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

@ObjectType('WorkMachinesTechInfoListItem')
export class TechInfoListItem {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  nameEn?: string | null
}
