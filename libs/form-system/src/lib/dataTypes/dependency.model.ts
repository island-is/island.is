import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator'
import { UUIDV4 } from 'sequelize'

@InputType('FormSystemDependencyInput')
@ObjectType('FormSystemDependency')
export class Dependency {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => UUIDV4)
  @ApiProperty({ type: String })
  @Field(() => String)
  parentProp!: string

  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @Type(() => UUIDV4)
  @ApiProperty({ type: [String] })
  @Field(() => [String])
  childProps!: string[]

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ type: Boolean })
  @Field(() => Boolean)
  isSelected!: boolean
}
