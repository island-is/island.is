import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CertificateInfoRepsonse {
  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  expirationDate?: string

  @Field({ nullable: true })
  releaseDate?: string
}
