import { createUnionType, Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DriverLicenseResult {
  @Field()
  name!: string

  @Field()
  nationalId!: string

  @Field(() => String, { nullable: true })
  picture?: string

  constructor({ name, nationalId, picture }: DriverLicenseResult) {
    this.name = name
    this.nationalId = nationalId
    this.picture = picture
  }
}

export const VerifyBarcodeDataUnion = createUnionType({
  name: 'VerifyBarcodeDataUnion',
  types: () => [DriverLicenseResult] as const,
})
