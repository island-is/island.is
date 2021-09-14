import { Field, ObjectType } from '@nestjs/graphql'
import { RskCompanyClassification } from './rskCompanyClassification.model'

@ObjectType()
export class RskCompanyVat {
  @Field(() => String)
  vatNumber!: string

  @Field(() => String)
  dateOfRegistration!: string

  @Field(() => String)
  status!: string

  @Field(() => String)
  deregistration!: string

  @Field(() => [RskCompanyClassification])
  classification!: RskCompanyClassification[]
}
