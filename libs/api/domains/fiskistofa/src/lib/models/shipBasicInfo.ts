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
  shippingCompany!: string

  @Field()
  /** Útgerðarflokkur */
  shippingClass!: string

  @Field()
  /** Heimahöfn */
  homePort!: string
}
