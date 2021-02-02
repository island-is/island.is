import { Field, ObjectType } from '@nestjs/graphql'
import { IHomestay } from '../client/models/homestay'

@ObjectType()
export class Homestay {
  @Field()
  registrationNumber: string

  @Field()
  name: string

  @Field()
  address: string

  @Field()
  manager: string

  @Field()
  year: number

  @Field({ nullable: true })
  city?: string
}

export const mapHomestay = (homestay: IHomestay): Homestay => ({
  registrationNumber: homestay.skraningarnumer,
  name: homestay.heitiHeimagistingar,
  address: homestay.heimilisfang,
  manager: homestay.abyrgdarmadur,
  year: homestay.umsoknarAr,
  city: homestay.sveitarfelag ?? '',
})
