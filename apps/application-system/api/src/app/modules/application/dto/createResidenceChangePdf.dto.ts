import {
  IsArray,
  IsObject,
  IsString,
} from 'class-validator'
import { ParentResidenceChange, ChildrenResidenceChange } from '@island.is/application/api-template-utils'
import { ApiProperty } from '@nestjs/swagger'

export class PersonDto {
  @IsString()
  @ApiProperty()
  readonly name!: string

  @IsString()
  @ApiProperty()
  readonly ssn!: string
}

export class ParentDto extends PersonDto{
  @IsString()
  @ApiProperty()
  readonly phoneNumber!: string

  @IsString()
  @ApiProperty()
  readonly email!: string

  @IsString()
  @ApiProperty()
  readonly homeAddress!: string

  @IsString()
  @ApiProperty()
  readonly postalCode!: string

  @IsString()
  @ApiProperty()
  readonly city!: string
}

export class CreateResidenceChangePdfDto {
  @IsObject()
  @ApiProperty({type: ParentDto})
  readonly parentA!: ParentResidenceChange

  @IsObject()
  @ApiProperty({type: ParentDto})
  readonly parentB!: ParentResidenceChange

  @IsArray()
  @ApiProperty({ type: [PersonDto] })
  readonly childrenAppliedFor!: Array<ChildrenResidenceChange>

  @IsString()
  @ApiProperty()
  readonly expiry!: string
}

