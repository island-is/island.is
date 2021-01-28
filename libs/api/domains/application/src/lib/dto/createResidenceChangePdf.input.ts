import { InputType, Field } from '@nestjs/graphql'
import {
  IsArray,
  IsObject,
  IsString,
} from 'class-validator'
import { ParentResidenceChange, ChildrenResidenceChange } from '@island.is/application/api-template-utils'

@InputType()
export class CreateResidenceChangePdfInput {
  @IsObject()
  parentA!: ParentResidenceChange

  @IsObject()
  parentB!: ParentResidenceChange

  @IsArray()
  childrenAppliedFor!: Array<ChildrenResidenceChange>

  @IsString()
  expiry!: string
}
