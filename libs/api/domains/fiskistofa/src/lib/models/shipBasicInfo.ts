import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FiskistofaShipBasicInfo {
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
