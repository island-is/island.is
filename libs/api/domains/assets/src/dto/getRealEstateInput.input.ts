import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetRealEstateInput {
  @Field()
  @IsString()
  assetId!: string
}

@InputType()
export class GetPagingTypes {
  @Field()
  @IsString()
  assetId!: string

  @Field()
  @IsString()
  @Field({ nullable: true })
  cursor?: string | null

  @Field()
  @IsString()
  @Field({ nullable: true })
  limit?: number | null
}

@InputType()
export class GetMultiPropertyInput {
  @Field()
  @IsString()
  @Field({ nullable: true })
  cursor?: string | null

  @Field()
  @IsString()
  @Field({ nullable: true })
  limit?: number | null
}
