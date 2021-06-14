import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'

@InputType()
class FiltersInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  typeId?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  status?: string[]
}

@InputType()
export class ApplicationPaymentStatusInput extends PartialType(FiltersInput) {
  @Field()
  @IsString()
  id!: string
}
