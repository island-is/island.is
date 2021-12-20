import { Field, ObjectType } from '@nestjs/graphql'
import { EmbaettiOgStarfsstodvar } from '@island.is/clients/syslumenn'

@ObjectType()
export class DistrictCommissionersAgenciesRepsonse {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  place?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  id?: string
}

export const mapDistrictCommissionersAgenciesRepsonse = (
  response: EmbaettiOgStarfsstodvar,
): DistrictCommissionersAgenciesRepsonse => {
  return {
    id: response.starfsstodID,
    name: response.nafn,
    place: response.stadur,
    address: response.adsetur
  }
}
