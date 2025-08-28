import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsServiceProvider')
export class ServiceProvider {
  @Field({ nullable: true })
  serviceProviderName?: string

  @Field({ nullable: true })
  coordinatorName?: string

  @Field({ nullable: true })
  coordinatorTitle?: string

  @Field({ nullable: true })
  workplace?: string

  @Field({ nullable: true })
  phoneNumber?: string
}
