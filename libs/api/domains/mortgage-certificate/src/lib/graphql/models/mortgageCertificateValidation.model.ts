import { Field, ObjectType, ID } from '@nestjs/graphql'
import { MortgageCertificateValidation } from '@island.is/clients/syslumenn'

@ObjectType()
export class MortgageCertificateValidationModel
  implements MortgageCertificateValidation {
  @Field()
  exists!: boolean

  @Field()
  hasKMarking!: boolean
}
