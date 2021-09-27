import { Field, ObjectType } from '@nestjs/graphql'
import { RskCompanyClassification } from './rskCompanyClassification.model'

@ObjectType()
export class RskCompanyVat {
  @Field(() => String, { nullable: true })
  vatNumber?: string

  @Field(() => String, { nullable: true })
  dateOfRegistration?: string

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => String, { nullable: true })
  deregistration?: string

  @Field(() => [RskCompanyClassification], { nullable: true })
  classification?: RskCompanyClassification[]
}
