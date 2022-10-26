import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { IsAssetId } from '@island.is/nest/validators'

@InputType()
export class GetRealEstateInput {
  @Field()
  @IsAssetId()
  assetId!: string
}

@InputType()
export class GetPagingTypes {
  @Field()
  @IsString()
  assetId!: string

  @IsString()
  @Field({ nullable: true })
  cursor?: string

  @Field({ nullable: true })
  limit?: number
}

@InputType()
export class GetMultiPropertyInput {
  @IsString()
  @Field({ nullable: true })
  cursor?: string

  @Field({ nullable: true })
  limit?: number
}
