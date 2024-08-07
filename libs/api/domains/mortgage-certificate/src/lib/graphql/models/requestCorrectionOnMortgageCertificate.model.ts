import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RequestCorrectionOnMortgageCertificateModel {
  @Field()
  hasSentRequest!: boolean
}
