import { Field, ObjectType } from '@nestjs/graphql'
import { LandBeneficiaryPayment } from './landBeneficiaryPayment.model'

@ObjectType('FarmerLandBeneficiary')
export class LandBeneficiary {
  @Field()
  name!: string

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  bankInfo?: string

  @Field({ nullable: true, description: 'Icelandic employment field category' })
  isat?: string

  @Field({ nullable: true })
  vskNumberDisplayString?: string

  @Field(() => [LandBeneficiaryPayment], { nullable: true })
  payments?: LandBeneficiaryPayment[]
}
