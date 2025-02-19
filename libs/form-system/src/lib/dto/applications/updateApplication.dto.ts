import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Dependency } from '@island.is/form-system-dataTypes'

@InputType('FormSystemUpdateApplicationInput')
export class UpdateApplicationDto {
  @ValidateNested()
  @Type(() => Dependency)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [Dependency] })
  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]

  @Type(() => String)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]
}
