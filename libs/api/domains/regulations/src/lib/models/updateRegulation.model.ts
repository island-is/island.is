import { Field, ObjectType, PartialType } from '@nestjs/graphql'
import { IRegulationPublishInput } from '../dto/saveRegulationPublish.input'

@ObjectType()
export class PartialIRegulationPublishInput extends PartialType(
  IRegulationPublishInput,
) {}

@ObjectType()
export class ValidationMessage {
  @Field(() => String, { nullable: true })
  readonly field?: string | null

  @Field()
  readonly code!: 'MissingValue' | 'InvalidValue' | 'Error'

  @Field(() => String, { nullable: true })
  readonly message?: string | null
}

@ObjectType()
export class UpdateError {
  @Field()
  readonly name!: string

  @Field()
  readonly message!: string

  @Field(() => String, { nullable: true })
  readonly stack?: string | null
}

@ObjectType()
export class RegulationUpdateData {
  @Field(() => Number, { nullable: true })
  readonly id?: number

  @Field(() => Number, { nullable: true })
  readonly regulationId?: number

  @Field(() => PartialIRegulationPublishInput, { nullable: true })
  readonly regulation?: PartialIRegulationPublishInput

  @Field(() => PartialIRegulationPublishInput, { nullable: true })
  readonly original?: PartialIRegulationPublishInput
}

@ObjectType()
export class UpdateRegulation {
  @Field()
  readonly success!: boolean

  @Field()
  readonly code!: number

  @Field(() => [ValidationMessage], { nullable: true })
  readonly errors?: Array<ValidationMessage>

  @Field(() => String, { nullable: true })
  readonly message?: string | UpdateError

  @Field(() => RegulationUpdateData, { nullable: true })
  readonly data?: RegulationUpdateData
}
