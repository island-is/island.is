import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  calculatorConfigSchema,
  TaxCalculatorType,
} from '@island.is/tax-calculators'
import type { CalculatorConfig } from '@island.is/tax-calculators'
import { logger } from '@island.is/logging'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { ICalculator, ICalculatorFields } from '../generated/contentfulTypes'

registerEnumType(TaxCalculatorType, {
  name: 'TaxCalculatorType',
  description: 'The tax calculator to use.',
})

@ObjectType()
export class Calculator {
  @Field(() => ID)
  id!: string

  @Field(() => TaxCalculatorType, { nullable: true })
  calculatorType?: TaxCalculatorType

  // Uses the shared JSON scalar because Slice members expose configJson under
  // the same response key.
  @CacheField(() => graphqlTypeJson, { nullable: true })
  configJson?: CalculatorConfig
}

const CALCULATOR_TYPE_BY_CONTENTFUL_VALUE: Record<
  ICalculatorFields['type'],
  TaxCalculatorType
> = {
  withholdingTaxOnWages: TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
  childBenefit: TaxCalculatorType.CHILD_BENEFIT,
  vehicleTax: TaxCalculatorType.VEHICLE_TAX,
  vehicleBenefit: TaxCalculatorType.VEHICLE_BENEFIT,
}

export const mapCalculator = ({
  sys,
  fields,
}: ICalculator): SystemMetadata<Calculator> => {
  let configJson: CalculatorConfig | undefined

  try {
    configJson = calculatorConfigSchema.parse(fields?.configJson)
  } catch (error) {
    logger.warn('Invalid calculator config', {
      id: sys.id,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return {
    typename: 'Calculator',
    id: sys.id,
    calculatorType: fields?.type
      ? CALCULATOR_TYPE_BY_CONTENTFUL_VALUE[fields.type]
      : undefined,
    configJson,
  }
}
