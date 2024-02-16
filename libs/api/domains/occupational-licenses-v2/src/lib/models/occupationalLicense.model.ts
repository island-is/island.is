import {
  ObjectType,
  Field,
  ID,
  InterfaceType,
  registerEnumType,
  GraphQLISODateTime,
} from '@nestjs/graphql'
import { nullable } from 'zod'

@ObjectType('OccupationalLicenseV2')
export class OccupationalLicenseV2 {
  @Field()
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  status?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  validFrom?: Date

  @Field({ nullable: true })
  issuer?: string
}
