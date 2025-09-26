import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsFunction')
export class MedicalDocumentFunction {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  keyNumber?: string

  @Field({ nullable: true })
  description?: string
}
