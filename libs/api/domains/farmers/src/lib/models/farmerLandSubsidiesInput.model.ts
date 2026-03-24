import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional } from 'class-validator'
import { registerEnumType } from '@nestjs/graphql'

export enum FarmerSubsidyOrderField {
  Contract = 'contract',
  PaymentCategory = 'paymentCategory',
  PaymentDate = 'paymentDate',
}

export enum FarmerSubsidyOrderDirection {
  Ascending = 'Ascending',
  Descending = 'Descending',
}

registerEnumType(FarmerSubsidyOrderField, { name: 'FarmerSubsidyOrderField' })
registerEnumType(FarmerSubsidyOrderDirection, {
  name: 'FarmerSubsidyOrderDirection',
})

@InputType()
export class FarmerLandSubsidiesInput {
  @Field(() => ID)
  farmId!: string

  @Field({ nullable: true })
  after?: string

  @Field(() => FarmerSubsidyOrderField, { nullable: true })
  @IsOptional()
  @IsEnum(FarmerSubsidyOrderField)
  orderField?: FarmerSubsidyOrderField

  @Field(() => FarmerSubsidyOrderDirection, { nullable: true })
  @IsOptional()
  @IsEnum(FarmerSubsidyOrderDirection)
  orderDirection?: FarmerSubsidyOrderDirection
}
