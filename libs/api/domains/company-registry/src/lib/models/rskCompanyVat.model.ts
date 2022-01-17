import { Field, ObjectType } from '@nestjs/graphql'
import { RskCompanyClassification } from './rskCompanyClassification.model'

@ObjectType()
export class RskCompanyVat {
  @Field(() => String, { nullable: true })
  vatNumber?: string

  @Field(() => Date, { nullable: true })
  dateOfRegistration?: Date

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => Date, { nullable: true })
  dateOfDeregistration?: Date

  @Field(() => [RskCompanyClassification], { nullable: true })
  classification?: RskCompanyClassification[]
}
