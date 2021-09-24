import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsString } from 'class-validator'

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

  @IsString()
  @Field({ nullable: true })
  cursor?: string | null

  @Field({ nullable: true })
  limit?: number | null
}

@InputType()
export class GetMultiPropertyInput {
  @IsString()
  @Field({ nullable: true })
  cursor?: string | null

  @Field({ nullable: true })
  limit?: number | null
}
