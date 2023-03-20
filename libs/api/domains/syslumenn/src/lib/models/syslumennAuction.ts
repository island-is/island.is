import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SyslumennAuction {
  @Field({ nullable: true })
  office?: string

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  auctionType?: string

  @Field({ nullable: true })
  lotType?: string

  @Field({ nullable: true })
  lotName?: string

  @Field({ nullable: true })
  lotId?: string

  @Field({ nullable: true })
  lotItems?: string

  @Field({ nullable: true })
  auctionDate?: string

  @Field({ nullable: true })
  auctionTime?: string

  @Field({ nullable: true })
  petitioners?: string

  @Field({ nullable: true })
  respondent?: string

  @Field({ nullable: true })
  publishText?: string

  @Field({ nullable: true })
  auctionTakesPlaceAt?: string
}
