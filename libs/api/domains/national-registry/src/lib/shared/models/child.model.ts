import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryChild')
export class Child {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String, { nullable: true })
  displayName?: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  middleName?: string

  @Field(() => String, { nullable: true })
  surname?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: true })
  gender?: string

  @Field(() => String, { nullable: true })
  genderDisplay?: string

  @Field(() => String, { nullable: true })
  birthday?: string

  @Field(() => String, { nullable: true })
  parent1?: string

  @Field(() => String, { nullable: true })
  nameParent1?: string

  @Field(() => String, { nullable: true })
  parent2?: string

  @Field(() => String, { nullable: true })
  nameParent2?: string

  @Field(() => String, { nullable: true })
  custody1?: string

  @Field(() => String, { nullable: true })
  nameCustody1?: string

  @Field(() => String, { nullable: true })
  custodyText1?: string

  @Field(() => String, { nullable: true })
  custody2?: string

  @Field(() => String, { nullable: true })
  nameCustody2?: string

  @Field(() => String, { nullable: true })
  custodyText2?: string

  @Field(() => String, { nullable: true })
  birthplace?: string

  @Field(() => String, { nullable: true })
  religion?: string

  @Field(() => String, { nullable: true })
  nationality?: string

  @Field(() => String, { nullable: true })
  homeAddress?: string

  @Field(() => String, { nullable: true })
  municipality?: string

  @Field(() => String, { nullable: true })
  postal?: string

  @Field(() => String, { nullable: true, description: 'Deprecated' })
  fate?: string
}
