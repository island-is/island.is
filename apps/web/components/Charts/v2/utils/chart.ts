import { ChartComponent } from '@island.is/web/graphql/schema'

import { ChartComponentType, ChartType } from '../types'

const KNOWN_COMPONENT_TYPES: ChartComponentType[] = [
  ChartComponentType.line,
  ChartComponentType.bar,
  ChartComponentType.area,
  ChartComponentType.pie,
]

export const decideChartBase = (
  components: ChartComponent[],
): ChartType | null => {
  const typeLookup = components.reduce((lookup, current) => {
    if (KNOWN_COMPONENT_TYPES.includes(current.type as ChartComponentType)) {
      lookup[current.type as ChartComponentType] = true
    } else {
      console.error(`Unknown type, ${current.type}, found in chart components`)
    }

    return lookup
  }, {} as Record<ChartComponentType, boolean>)

  const types = Object.keys(typeLookup).map((type) =>
    type === ChartComponentType.pie ? ChartType.pie : type,
  )

  if (types.length === 0) {
    // No known types found in chart component
    // So we cant decide chart base
    return null
  } else if (types.length === 1) {
    // Only have one known type, return it
    return types[0] as ChartType
  } else if (types.includes('pie')) {
    // We have multiple types, and pie is one of them
    console.error(`Pie compnent can not be used with other component types`)
    return null
  }

  return ChartType.mixed
}
