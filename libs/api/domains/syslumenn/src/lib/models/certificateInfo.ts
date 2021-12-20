import { Field, ObjectType } from '@nestjs/graphql'
import { VottordSkeyti } from '@island.is/clients/syslumenn'

@ObjectType()
export class CertificateInfoRepsonse {
  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  expirationDate?: string

  @Field({ nullable: true })
  releaseDate?: string
}

export const mapCertificateInfo = (
  response: VottordSkeyti,
): CertificateInfoRepsonse => {
  return {
    nationalId: response.kennitala,
    expirationDate: response.gildisTimi,
    releaseDate: response.utgafudagur,
  }
}
