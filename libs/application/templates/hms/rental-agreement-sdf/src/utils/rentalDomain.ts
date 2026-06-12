import type { DataTableRow } from '@island.is/application/types'

export type RentalPropertyUnit = {
  propertyCode?: number
  propertyUsageDescription?: string
  size?: number
  sizeUnit?: string
  unitCode?: string
}

export type RentalPropertyUnitAnswer = RentalPropertyUnit & {
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
}

export type RentalAppraisalUnit = {
  unitCode?: string
  propertyUsageDescription?: string
  units?: RentalPropertyUnit[]
}

export type RentalPropertyInfo = {
  propertyCode?: number
  propertyUsageDescription?: string
  size?: number
  sizeUnit?: string
  unitCode?: string
  appraisalUnits?: RentalAppraisalUnit[]
}

export type RentalPropertyInfoRowLabels = {
  sizeLabel: string
  roomsLabel: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined

const toString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

export const mapRentalPropertyUnit = (
  value: unknown,
): RentalPropertyUnit | null => {
  if (!isRecord(value)) return null
  return {
    propertyCode: toNumber(value.propertyCode),
    propertyUsageDescription: toString(value.propertyUsageDescription),
    size: toNumber(value.size),
    sizeUnit: toString(value.sizeUnit),
    unitCode: toString(value.unitCode),
  }
}

export const mapRentalPropertyInfo = (
  value: unknown,
): RentalPropertyInfo | null => {
  if (!isRecord(value)) return null
  const appraisalUnits = Array.isArray(value.appraisalUnits)
    ? value.appraisalUnits.filter(isRecord).map((unit) => ({
        unitCode: toString(unit.unitCode),
        propertyUsageDescription: toString(unit.propertyUsageDescription),
        units: Array.isArray(unit.units)
          ? unit.units
              .map(mapRentalPropertyUnit)
              .filter((u): u is RentalPropertyUnit => u !== null)
          : [],
      }))
    : []

  return {
    propertyCode: toNumber(value.propertyCode),
    propertyUsageDescription: toString(value.propertyUsageDescription),
    size: toNumber(value.size),
    sizeUnit: toString(value.sizeUnit),
    unitCode: toString(value.unitCode),
    appraisalUnits,
  }
}

export const rentalUnitKey = (
  propertyCode?: number,
  unitCode?: string,
): string => `${propertyCode ?? 'property'}_${unitCode ?? 'unit'}`

export const mapRentalPropertyInfoToRows = (
  properties: Array<RentalPropertyInfo | null>,
  labels: RentalPropertyInfoRowLabels,
): DataTableRow[] =>
  properties
    .filter((property): property is RentalPropertyInfo => property !== null)
    .map((property) => ({
      id: String(property.propertyCode ?? property.unitCode ?? 'property'),
      cells: [
        String(property.propertyCode ?? ''),
        property.unitCode ?? '',
        property.size ? `${property.size} ${property.sizeUnit ?? 'm²'}` : '',
        '',
      ],
      expandable: {
        rows: (property.appraisalUnits ?? []).flatMap((appraisalUnit) =>
          (appraisalUnit.units ?? []).map((unit) => {
            const key = rentalUnitKey(
              unit.propertyCode ?? property.propertyCode,
              unit.unitCode,
            )
            return {
              id: key,
              label:
                unit.propertyUsageDescription ?? appraisalUnit.unitCode ?? '',
              cells: [unit.unitCode ?? ''],
              hasCheckbox: true,
              checkboxKey: 'checked',
              payload: {
                ...unit,
                propertyCode: unit.propertyCode ?? property.propertyCode,
              },
              defaultValues: {
                changedSize: unit.size ?? 0,
                numOfRooms: 0,
              },
              inputs: [
                {
                  key: 'changedSize',
                  label: labels.sizeLabel,
                  type: 'number' as const,
                  min: 0,
                  suffix: unit.sizeUnit ?? 'm²',
                },
                {
                  key: 'numOfRooms',
                  label: labels.roomsLabel,
                  type: 'number' as const,
                  min: 0,
                },
              ],
            }
          }),
        ),
      },
    }))

export const mapRentalSelectedUnitAnswer = (
  value: unknown,
): RentalPropertyUnitAnswer | null => {
  const unit = mapRentalPropertyUnit(value)
  if (!unit || !isRecord(value)) return null
  return {
    ...unit,
    checked: value.checked === true,
    changedSize: toNumber(value.changedSize),
    numOfRooms: toNumber(value.numOfRooms),
  }
}

export const getSelectedRentalUnits = (
  units: unknown,
): RentalPropertyUnitAnswer[] => {
  if (!Array.isArray(units)) return []
  return units
    .map(mapRentalSelectedUnitAnswer)
    .filter((unit): unit is RentalPropertyUnitAnswer => unit?.checked === true)
}

export const calculateRentalPropertySize = (
  selectedUnits: RentalPropertyUnitAnswer[],
): number =>
  selectedUnits
    .filter((unit) => unit.checked === true)
    .reduce((sum, unit) => {
      const changedSize = Number(unit.changedSize)
      return sum + (Number.isFinite(changedSize) ? changedSize : unit.size ?? 0)
    }, 0)

export const hasRentalUnitSizeChanged = (
  selectedUnits: RentalPropertyUnitAnswer[],
): boolean =>
  selectedUnits
    .filter((unit) => unit.checked === true)
    .some((unit) => {
      if (typeof unit.changedSize !== 'number') return false
      return unit.size === undefined || unit.changedSize !== unit.size
    })

export const requiredSmokeDetectorCount = (propertySize: number): number =>
  propertySize > 0 ? Math.ceil(propertySize / 80) : 0

export const shouldShowSmokeDetectorAlert = (
  propertySize: number,
  smokeDetectors: unknown,
): boolean => {
  const smokeDetectorCount = Number(smokeDetectors)
  const requiredCount = requiredSmokeDetectorCount(propertySize)
  return (
    requiredCount > 0 &&
    (!Number.isFinite(smokeDetectorCount) || smokeDetectorCount < requiredCount)
  )
}

export const shouldShowFireExtinguisherAlert = (
  fireExtinguisher: unknown,
): boolean => {
  const fireExtinguisherCount = Number(fireExtinguisher)
  return !Number.isFinite(fireExtinguisherCount) || fireExtinguisherCount < 1
}
