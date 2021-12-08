import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CertificateInfoRepsonse {
  @Field()
  nationalId?: string

  @Field()
  expirationDate?: string

  @Field()
  releaseDate?: string
}