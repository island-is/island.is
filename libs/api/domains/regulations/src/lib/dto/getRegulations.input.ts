import { Field, InputType } from '@nestjs/graphql'
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator'

@InputType()
export class GetRegulationsInput {
  @Field(() => String)
  @IsIn(['newest'])
  type!: 'newest'

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number
}
