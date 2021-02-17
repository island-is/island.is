import { Field, ObjectType } from '@nestjs/graphql'
import { IHomestay } from '../client/models/homestay'

@ObjectType()
export class Homestay {
  @Field({ nullable: true })
  registrationNumber?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  manager?: string

  @Field({ nullable: true })
  year?: number

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
