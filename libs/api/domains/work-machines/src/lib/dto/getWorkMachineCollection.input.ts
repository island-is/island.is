import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType('WorkMachinesCollectionInput')
export class GetWorkMachineCollectionInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchQuery?: string

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  pageNumber?: number

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  pageSize?: number

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  orderBy?: string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  showDeregisteredMachines?: boolean

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  supervisorRegistered?: boolean

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  onlyInOwnerChangeProcess?: boolean

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  locale?: string
}
