import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsDoctor')
export class Doctor {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  doctorNumber?: string

  @Field({ nullable: true })
  residence?: string
}
