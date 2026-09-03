import { Inject, Injectable } from '@nestjs/common'

import {
  getCalculatorInputProps,
  type CalculatorKey,
  type InputProp,
} from '@island.is/clients/rsk/calculators'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { mapInputPropToField } from './mapper'
import { CalculatorField } from './models/field.model'
import { FieldDependency } from './models/fieldDependency.model'

/* The client exposes six calculators; only the four the shared
 * TaxCalculatorType declares are reachable, since that enum is what Contentful
 * authors against. `withholdingTaxOnWages` is the one name that differs
 * between the two vocabularies. */
const CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE: Record<
  TaxCalculatorType,
  CalculatorKey
> = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: 'withholdingTax',
  [TaxCalculatorType.CHILD_BENEFIT]: 'childBenefit',
  [TaxCalculatorType.VEHICLE_TAX]: 'vehicleTax',
  [TaxCalculatorType.VEHICLE_BENEFIT]: 'vehicleBenefit',
}

@Injectable()
export class TaxCalculatorsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getFields(calculatorType: TaxCalculatorType): CalculatorField[] {
    const calculatorKey = CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE[calculatorType]

    return getCalculatorInputProps(calculatorKey).map((prop) =>
      mapInputPropToField(prop, this.toDependency(calculatorKey, prop)),
    )
  }

  /* `InputProp.dependsOn.value` is `unknown` because the client derives it
   * from whatever a zod discriminated union discriminates on. Every such
   * discriminant is a boolean literal today, so a non-boolean means RSK's
   * contract changed shape. Degrade rather than throw -- this query serves a
   * public, unauthenticated page, so throwing would turn a schema drift into a
   * 500 for every visitor. Dropping the dependency instead leaves the field
   * unconditional, which the warning makes traceable. */
  private toDependency(
    calculatorKey: CalculatorKey,
    prop: InputProp,
  ): FieldDependency | undefined {
    if (!prop.dependsOn) {
      return undefined
    }

    const { field, value } = prop.dependsOn
    if (typeof value !== 'boolean') {
      this.logger.warn(
        `Dropping non-boolean dependency on tax calculator field: calculator=${calculatorKey} field=${prop.name} dependsOn=${field}`,
      )
      return undefined
    }

    return { field, equals: value }
  }
}
