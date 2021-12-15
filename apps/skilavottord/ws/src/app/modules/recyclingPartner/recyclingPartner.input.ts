import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RecyclingPartnerInput {
  @Field()
  companyId!: string
}

@InputType()
export class CreateRecyclingPartnerInput {
  @Field()
  companyId!: string

  @Field()
  companyName!: string

  @Field()
  address!: string

  @Field()
  postnumber!: string

  @Field()
  city!: string

  @Field()
  website!: string

  @Field()
  phone!: string

  @Field()
  active!: boolean
}

@InputType()
export class UpdateRecyclingPartnerInput {
  @Field()
  companyId!: string

  @Field()
  companyName!: string

  @Field()
  address!: string

  @Field()
  postnumber!: string

  @Field()
  city!: string

  @Field()
  website!: string

  @Field()
  phone!: string

  @Field()
  active!: boolean
}

@InputType()
export class DeleteRecyclingPartnerInput {
  @Field()
  companyId!: string
}
