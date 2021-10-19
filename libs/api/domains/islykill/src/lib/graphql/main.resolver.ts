import {
  Query,
  Resolver,
  Field,
  ObjectType,
  Mutation,
  InputType,
  Args,
} from '@nestjs/graphql'
import { IsEmail, IsOptional } from 'class-validator'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { IslykillService } from '../islykill.service'

@ObjectType()
export class IslykillSettings {
  @Field({ description: 'National ID' })
  nationalId!: string

  @Field({ description: 'Email', nullable: true })
  email?: string

  @Field({ description: 'Mobile phonenumber', nullable: true })
  mobile?: string

  @Field({ description: 'Bank info', nullable: true })
  bankInfo?: string

  @Field({ description: 'Datetime of last login', nullable: true })
  lastLogin?: string

  @Field({ description: 'Datetime of next to last login', nullable: true })
  nextLastLogin?: string

  @Field({
    description: 'Datetime of last time Íslykill was changed',
    nullable: true,
  })
  lastPassChange?: string

  @Field({ description: 'Does the user allow "nudges"', nullable: true })
  canNudge?: boolean

  @Field({
    description: 'Can the user only login via certificate, not via Íslykill',
    nullable: true,
  })
  onlyCert?: boolean

  @Field({
    description: 'Datetime of when user was last asked about "nudging"',
    nullable: true,
  })
  nudgeLastAsked?: string

  @Field({
    description: 'No user with requested ssn found in request',
    nullable: true,
  })
  noUserFound?: boolean
}

@ObjectType()
export class IslykillErrorResult {
  @Field(() => String)
  message!: string

  @Field(() => String)
  code!: number

  @Field(() => [String])
  invalidFields!: string[]
}

@ObjectType()
export class UpdateIslykillSettings {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  valid!: boolean

  @Field(() => IslykillErrorResult, { nullable: true })
  error?: IslykillErrorResult
}

@ObjectType()
export class CreateIslykillSettings {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  valid!: boolean

  @Field(() => IslykillErrorResult, { nullable: true })
  error?: IslykillErrorResult
}

@ObjectType()
export class DeleteIslykillSettings {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  valid!: boolean

  @Field(() => IslykillErrorResult, { nullable: true })
  error?: IslykillErrorResult
}

@InputType()
export class UpdateIslykillSettingsInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  mobile?: string
}

@InputType()
export class CreateIslykillSettingsInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  mobile?: string
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly islykillService: IslykillService) {}

  @Query(() => IslykillSettings)
  async getIslykillSettings(
    @CurrentUser() user: User,
  ): Promise<IslykillSettings> {
    return this.islykillService.getIslykillSettings(user.nationalId)
  }

  @Mutation(() => UpdateIslykillSettings)
  async updateIslykillSettings(
    @CurrentUser() user: User,
    @Args('input') input: UpdateIslykillSettingsInput,
  ) {
    return this.islykillService.updateIslykillSettings(user.nationalId, {
      email: input.email,
      mobile: input.mobile,
    })
  }

  @Mutation(() => CreateIslykillSettings)
  async createIslykillSettings(
    @CurrentUser() user: User,
    @Args('input') input: CreateIslykillSettingsInput,
  ) {
    return this.islykillService.createIslykillSettings(user.nationalId, {
      email: input.email,
      mobile: input.mobile,
    })
  }

  @Mutation(() => DeleteIslykillSettings)
  async deleteIslykillSettings(@CurrentUser() user: User) {
    return this.islykillService.deleteIslykillSettings(user.nationalId)
  }
}
