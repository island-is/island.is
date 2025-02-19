import { Field, InputType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

@InputType('FormSystemUpdateOrganizationUrlInput')
export class UpdateOrganizationUrlDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  url?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  isXroad?: boolean

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  method?: string
}
