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

  @Field({ nullable: true, description: 'ÍSAT industry classification code for the beneficiary' })
  isat?: string

  @Field({ nullable: true, description: 'Virðisaukaskattur' })
  vatNumber?: string

  @Field(() => [LandBeneficiaryPayment], { nullable: true })
  payments?: LandBeneficiaryPayment[]
}
