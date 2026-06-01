import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FormSystemPersonName {
  @Field(() => String, { nullable: true })
  firstName?: string | null

  @Field(() => String, { nullable: true })
  middleName?: string | null

  @Field(() => String, { nullable: true })
  lastName?: string | null

  @Field(() => String, { nullable: true })
  fullName?: string | null

  @Field(() => String, { nullable: true })
  displayName?: string | null
}

@ObjectType()
export class FormSystemPersonAddress {
  @Field(() => String, { nullable: true })
  streetAddress?: string | null

  @Field(() => String, { nullable: true })
  apartment?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  municipalityText?: string | null
}

@ObjectType()
export class FormSystemPersonByNationalId {
  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName?: string | null

  @Field(() => FormSystemPersonName, { nullable: true })
  name?: FormSystemPersonName | null

  @Field(() => FormSystemPersonAddress, { nullable: true })
  address?: FormSystemPersonAddress | null
}
