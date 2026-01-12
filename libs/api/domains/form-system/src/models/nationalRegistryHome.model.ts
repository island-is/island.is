import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FormSystemAddressByNationalId {
  @Field(() => String, { nullable: true })
  husHeiti?: string | null

  @Field(() => String, { nullable: true })
  ibud?: string | null

  @Field(() => String, { nullable: true })
  postnumer?: string | null

  @Field(() => String, { nullable: true })
  poststod?: string | null

  @Field(() => String, { nullable: true })
  sveitarfelag?: string | null

  @Field(() => String, { nullable: true })
  tegundHeimilisfangs?: string | null
}

@ObjectType()
export class FormSystemHomeByNationalId {
  @Field(() => String, { nullable: true })
  logheimiliskodi?: string | null

  @Field(() => String, { nullable: true })
  logheimiliskodi112?: string | null

  @Field(() => String, { nullable: true })
  logheimiliskodiSIsl?: string | null

  @Field(() => FormSystemAddressByNationalId, { nullable: true })
  adsetur?: FormSystemAddressByNationalId | null

  @Field(() => FormSystemAddressByNationalId, { nullable: true })
  heimilisfang?: FormSystemAddressByNationalId | null
}
