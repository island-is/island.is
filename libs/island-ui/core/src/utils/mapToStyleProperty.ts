import type { StyleRule } from '@vanilla-extract/css'
import { Properties } from 'csstype'
import mapValues from 'lodash/mapValues'

export const mapToStyleProperty = <
  Key extends string | number,
  Value extends string | number
>(
  map: Record<Key, Value>,
  propertyName: keyof Properties,
  mapper?: (value: Value, propertyName: keyof Properties) => StyleRule,
) =>
  mapValues(map, (value: Value) =>
    mapper ? mapper(value, propertyName) : { [propertyName]: value },
  )
