import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql'
import { Invoice } from './invoice.model'

@ObjectType('IcelandicGovernmentInstitutionsPayment')
export class Payment {
  @Field(() => ID)
  id!: string

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => Float)
  amount!: number

  @Field(() => Invoice)
  invoice!: Invoice
}
