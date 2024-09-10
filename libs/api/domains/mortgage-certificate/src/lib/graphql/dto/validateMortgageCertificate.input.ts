import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@InputType()
export class Properties {
  @Field()
  @IsString()
  propertyNumber!: string

  @Field()
  @IsString()
  propertyType!: string
}

@InputType()
export class ValidateMortgageCertificateInput {
  @CacheField(() => [Properties])
  properties!: Properties[]
}
