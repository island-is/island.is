import { Field, ObjectType } from '@nestjs/graphql'
export interface ISyslumennAuction {
  embaetti?: string
  starfsstod?: string
  tegund?: string
  andlag?: string
  dagsetning?: string
  klukkan?: string
  fastanumer?: string
  andlagHeiti?: string
  gerdarbeidendur?: string
  gerdartholar?: string
  lausafjarmunir?: string
}


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
}

export const mapSyslumennAuction = (
  auction: ISyslumennAuction,
): SyslumennAuction => ({
  office: auction.embaetti ?? '',
  location: auction.starfsstod ?? '',
  auctionType: auction.tegund ?? '',
  lotType: auction.andlag ?? '',
  lotName: auction.andlagHeiti ?? '',
  lotId: auction.fastanumer ?? '',
  lotItems: auction.lausafjarmunir ?? '',
  auctionDate: auction.dagsetning ?? '',
  auctionTime: auction.klukkan ?? '',
  petitioners: auction.gerdarbeidendur ?? '',
  respondent: auction.gerdartholar ?? '',
})
