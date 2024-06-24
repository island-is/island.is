import { Field, ObjectType } from '@nestjs/graphql'
import { MortgageCertificateValidation } from '@island.is/clients/syslumenn'

@ObjectType()
export class MortgageCertificateValidationModel
  implements MortgageCertificateValidation
{
  @Field()
  propertyNumber!: string

  @Field()
  exists!: boolean

  @Field()
  hasKMarking!: boolean
}
