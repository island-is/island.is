import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class OrganizationLogoInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string

  @Field(() => String, { nullable: false })
  @IsString()
  organizationTitle!: string
}
