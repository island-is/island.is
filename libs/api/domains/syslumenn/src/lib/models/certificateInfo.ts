import { Field, ObjectType } from '@nestjs/graphql'
import { Skilabod, Vottord } from '@island.is/clients/syslumenn'

@ObjectType()
export class CertificateInfoRepsonse {
  @Field()
  nationalId?: string

  @Field()
  expirationDate?: string

  @Field()
  releaseDate?: string
}
@ObjectType()
export class CertificateRepsonse {
  @Field()
  data?: string
}
export const mapCertificateInfo = (response: Vottord): CertificateInfoRepsonse => {
  console.log(response)
  return {
    nationalId: response.kennitala ?? '',
    expirationDate: response.gildisTimi ?? '',
    releaseDate: response.utgafudagur ?? '',
}
}