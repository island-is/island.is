import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryChild {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String)
  displayName?: string

  @Field(() => String)
  middleName?: string

  @Field(() => String)
  surname?: string

  @Field(() => String)
  gender?: string

  @Field(() => String)
  genderDisplay?: string

  @Field(() => String)
  birthday?: string

  @Field(() => String)
  parent1?: string

  @Field(() => String)
  nameParent1?: string

  @Field(() => String)
  parent2?: string

  @Field(() => String)
  nameParent2?: string

  @Field(() => String)
  custody1?: string

  @Field(() => String)
  nameCustody1?: string

  @Field(() => String)
  custodyText1?: string

  @Field(() => String)
  custody2?: string

  @Field(() => String)
  nameCustody2?: string

  @Field(() => String)
  custodyText2?: string

  @Field(() => String)
  birthplace?: string

  @Field(() => String)
  religion?: string

  @Field(() => String)
  nationality?: string

  @Field(() => String)
  homeAddress?: string

  @Field(() => String)
  municipality?: string

  @Field(() => String)
  postal?: string
}
