import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class FiskistofaShipBasicInfo {
  @Field()
  /** Skipaskránúmer */
  id?: number

  @Field()
  /** Heiti */
  name!: string

  @Field()
  /** Útgerð */
  operator!: string

  @Field()
  /** Útgerðarflokkur */
  typeOfVessel!: string

  @Field()
  /** Heimahöfn */
  homePort!: string
}

@ObjectType()
export class FiskistofaShipBasicInfoResponse {
  @Field(() => [FiskistofaShipBasicInfo], { nullable: true })
  fiskistofaShips?: FiskistofaShipBasicInfo[]
}
