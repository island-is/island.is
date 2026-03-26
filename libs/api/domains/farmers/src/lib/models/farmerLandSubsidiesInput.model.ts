import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional } from 'class-validator'
import {
  FarmerLandSubsidyOrderDirection,
  FarmerLandSubsidyOrderField,
} from './enums'

@InputType()
export class FarmerLandSubsidiesInput {
  @Field(() => ID)
  farmId!: string

  @Field({ nullable: true })
  after?: string

  @Field(() => FarmerLandSubsidyOrderField, { nullable: true })
  @IsOptional()
  @IsEnum(FarmerLandSubsidyOrderField)
  orderField?: FarmerLandSubsidyOrderField

  @Field(() => FarmerLandSubsidyOrderDirection, {
    nullable: true,
    description:
      'Sort direction. Only has effect when orderField is also provided. Defaults to ascending.',
  })
  @IsOptional()
  @IsEnum(FarmerLandSubsidyOrderDirection)
  orderDirection?: FarmerLandSubsidyOrderDirection
}
