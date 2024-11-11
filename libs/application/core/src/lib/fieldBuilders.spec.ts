import { Field } from '@island.is/application/types'

import { FieldComponents, FieldTypes } from '@island.is/application/types'

import { Application } from '@island.is/application/types'
import { buildFieldOptions, buildFieldRequired } from './fieldBuilders'

describe('buildFieldOptions', () => {
  const mockApplication = {
    id: 'test-app',
    state: 'draft',
    answers: {},
  } as Application

  const mockField = {
    id: 'test-field',
    type: FieldTypes.SELECT,
    component: FieldComponents.SELECT,
  } as Field

  it('should return options array when passed static options', () => {
    const staticOptions = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ]

    const result = buildFieldOptions(
      staticOptions,
      mockApplication,
      mockField,
      'is',
    )

    expect(result).toEqual(staticOptions)
  })

  it('should call function with application and field when passed function', () => {
    const dynamicOptions = jest.fn().mockReturnValue([
      { label: 'Dynamic 1', value: 'd1' },
      { label: 'Dynamic 2', value: 'd2' },
    ])

    const result = buildFieldOptions(
      dynamicOptions,
      mockApplication,
      mockField,
      'is',
    )

    expect(dynamicOptions).toHaveBeenCalledWith(
      mockApplication,
      mockField,
      'is',
    )
    expect(result).toEqual([
      { label: 'Dynamic 1', value: 'd1' },
      { label: 'Dynamic 2', value: 'd2' },
    ])
  })
})

describe('buildFieldRequired', () => {
  const mockApplication = {
    id: 'test-app',
    state: 'draft',
    answers: {},
  } as Application

  it('should return boolean value when passed static boolean', () => {
    expect(buildFieldRequired(mockApplication, true)).toBe(true)
    expect(buildFieldRequired(mockApplication, false)).toBe(false)
  })

  it('should return undefined when passed undefined', () => {
    expect(buildFieldRequired(mockApplication, undefined)).toBeUndefined()
  })

  it('should call function with application when passed function', () => {
    const dynamicRequired = jest.fn().mockReturnValue(true)

    const result = buildFieldRequired(mockApplication, dynamicRequired)

    expect(dynamicRequired).toHaveBeenCalledWith(mockApplication)
    expect(result).toBe(true)
  })
})
