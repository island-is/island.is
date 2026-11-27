import { FormSystemField, FormSystemFieldSettings } from '@island.is/api/schema'
import { FamilyTypes, FieldTypesEnum } from '@island.is/form-system/enums'
import { expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ReactNode, useContext, useReducer } from 'react'
import {
  ControlContext,
  IControlContext,
} from '../../../../../../../context/ControlContext'
import { controlReducer } from '../../../../../../../hooks/controlReducer'
import { FamilySettings } from './FamilySettings'

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  Select: ({
    label,
    options,
    value,
    isDisabled,
    onChange,
  }: {
    label: string
    options: Array<{ label: string; value: string }>
    value: { value: string } | null
    isDisabled: boolean
    onChange: (option?: { label: string; value: string }) => void
  }) => (
    <select
      aria-label={label}
      value={value?.value ?? ''}
      disabled={isDisabled}
      onChange={(event) =>
        onChange(options.find((option) => option.value === event.target.value))
      }
    >
      <option value="" />
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}))

const renderSettings = (
  fieldSettings: FormSystemFieldSettings,
  isReadOnly = false,
  isPartOfMultiset = false,
) => {
  const controlDispatch = jest.fn()
  const updateActiveItem = jest.fn()
  const field: FormSystemField = {
    id: 'family',
    name: { is: 'Family' },
    screenId: 'screen',
    isRequired: false,
    fieldType: FieldTypesEnum.FAMILY,
    fieldSettings,
    isPartOfMultiset,
  }
  const Settings = () => {
    const defaults = useContext(ControlContext)
    const [control, dispatch] = useReducer(controlReducer, {
      ...defaults.control,
      activeItem: { type: 'Field', data: field },
      form: { ...defaults.control.form, fields: [field] },
      isReadOnly,
    })
    return (
      <ControlContext.Provider
        value={{
          ...defaults,
          control,
          controlDispatch: (action) => {
            controlDispatch(action)
            dispatch(action)
          },
          updateActiveItem,
        }}
      >
        <FamilySettings />
      </ControlContext.Provider>
    )
  }
  render(<Settings />)
  return { controlDispatch, updateActiveItem }
}

it.each([false, true])(
  'selecting the child type updates and saves multiset=false from %s',
  (isPartOfMultiset) => {
    const { updateActiveItem } = renderSettings(
      { familyType: FamilyTypes.SPOUSE },
      false,
      isPartOfMultiset,
    )

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: FamilyTypes.CHILD },
    })

    expect(screen.getByRole('combobox')).toHaveProperty(
      'value',
      FamilyTypes.CHILD,
    )
    expect(updateActiveItem).toHaveBeenLastCalledWith({
      type: 'Field',
      data: expect.objectContaining({
        id: 'family',
        isPartOfMultiset: false,
        fieldSettings: { familyType: FamilyTypes.CHILD },
      }),
    })
  },
)

it.each([
  FamilyTypes.CHILD,
  FamilyTypes.APPLICANT_INFO,
  FamilyTypes.SPOUSE,
  FamilyTypes.NATIONAL_ID_ESTATE,
])('does not offer child-source settings for %s', (familyType) => {
  renderSettings({ familyType })

  expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
})

it.each([false, true])(
  'clears legacy child multiset membership only in editable settings (read-only=%s)',
  (isReadOnly) => {
    const { controlDispatch, updateActiveItem } = renderSettings(
      { familyType: FamilyTypes.CHILD },
      isReadOnly,
      true,
    )

    if (isReadOnly) {
      expect(controlDispatch).not.toHaveBeenCalled()
    } else {
      expect(controlDispatch).toHaveBeenCalledWith({
        type: 'CHANGE_IS_PART_OF_MULTI',
        payload: { update: updateActiveItem },
      })
    }
  },
)

it.each([false, true])(
  'explains which children appear with read-only=%s',
  (isReadOnly) => {
    renderSettings({ familyType: FamilyTypes.CHILD }, isReadOnly)

    const explanation = screen.getByText(
      'Í listanum birtast börn sem umsækjandi fer með forsjá yfir samkvæmt Þjóðskrá. Börn sem umsækjandi fer ekki með forsjá yfir birtast ekki í listanum.',
    )
    expect(
      explanation.compareDocumentPosition(screen.getByRole('combobox')) &
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy()
  },
)

it.each([
  undefined,
  FamilyTypes.APPLICANT_INFO,
  FamilyTypes.SPOUSE,
  FamilyTypes.NATIONAL_ID_ESTATE,
])('does not show the child explanation for %s', (familyType) => {
  renderSettings({ familyType })

  expect(screen.queryByText(/Í listanum birtast börn/)).toBeNull()
  expect(screen.queryAllByRole('radio')).toHaveLength(0)
})

it.each([false, true])(
  'does not offer child display-mode options with read-only=%s',
  (isReadOnly) => {
    renderSettings({ familyType: FamilyTypes.CHILD }, isReadOnly)

    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(screen.getAllByRole('combobox')).toHaveLength(1)
  },
)

it.each([false, true])(
  'offers the applicant family type with read-only=%s',
  (isReadOnly) => {
    const controlDispatch = jest.fn()
    const updateActiveItem = jest.fn()
    render(
      <ControlContext.Provider
        value={
          {
            control: {
              activeItem: {
                data: { fieldSettings: { familyType: FamilyTypes.CHILD } },
              },
              isReadOnly,
            },
            controlDispatch,
            updateActiveItem,
          } as unknown as IControlContext
        }
      >
        <FamilySettings />
      </ControlContext.Provider>,
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(screen.getByRole('option', { name: 'Umsækjandi' })).toBeTruthy()
    expect(select.disabled).toBe(isReadOnly)
    if (!isReadOnly) {
      fireEvent.change(select, {
        target: { value: FamilyTypes.APPLICANT_INFO },
      })
      expect(controlDispatch).toHaveBeenCalledWith({
        type: 'SET_ANY_FIELD_SETTING',
        payload: {
          property: 'familyType',
          value: FamilyTypes.APPLICANT_INFO,
          update: updateActiveItem,
        },
      })
    }
  },
)
