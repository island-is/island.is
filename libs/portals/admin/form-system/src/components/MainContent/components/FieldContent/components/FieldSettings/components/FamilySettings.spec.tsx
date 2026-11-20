import { FormSystemFieldSettings } from '@island.is/api/schema'
import { FamilyTypes } from '@island.is/form-system/enums'
import { expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import {
  ControlContext,
  IControlContext,
} from '../../../../../../../context/ControlContext'
import { FamilySettings } from './FamilySettings'

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Checkbox: ({
    name,
    label,
    subLabel,
    large,
    checked,
    disabled,
    onChange,
  }: {
    name?: string
    label: string
    subLabel?: string
    large?: boolean
    checked: boolean
    disabled: boolean
    onChange: React.ChangeEventHandler<HTMLInputElement>
  }) => (
    <div>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label htmlFor={name} data-large={large}>
        {label}
        {large && subLabel && <span>{subLabel}</span>}
      </label>
    </div>
  ),
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
) => {
  const controlDispatch = jest.fn()
  const updateActiveItem = jest.fn()
  render(
    <ControlContext.Provider
      value={
        {
          control: {
            activeItem: { data: { fieldSettings } },
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
  return { controlDispatch, updateActiveItem }
}

it('shows separate large child source checkboxes with explanatory sublabels', () => {
  const { controlDispatch, updateActiveItem } = renderSettings({
    familyType: FamilyTypes.CHILD,
  })

  const biological = screen.getByRole('checkbox', { name: /Sýna kynbörn/ })
  const custody = screen.getByRole('checkbox', { name: /Sýna börn í forsjá/ })
  expect(biological.id).not.toBe(custody.id)
  expect(
    screen
      .getByText('Sýna kynbörn')
      .closest('label')
      ?.getAttribute('data-large'),
  ).toBe('true')
  expect(
    screen
      .getByText('Sýna börn í forsjá')
      .closest('label')
      ?.getAttribute('data-large'),
  ).toBe('true')
  expect(
    screen.getByText(
      'Sýnir kynbörn viðkomandi samkvæmt Þjóðskrá, óháð forsjá.',
    ),
  ).toBeTruthy()
  expect(
    screen.getByText(
      'Sýnir börn sem viðkomandi fer með forsjá yfir samkvæmt Þjóðskrá, óháð skyldleika.',
    ),
  ).toBeTruthy()
  fireEvent.click(screen.getByText('Sýna kynbörn'))
  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'SET_ANY_FIELD_SETTING',
    payload: {
      property: 'showBiologicalChildren',
      value: false,
      update: updateActiveItem,
    },
  })
  fireEvent.click(screen.getByText('Sýna börn í forsjá'))
  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'SET_ANY_FIELD_SETTING',
    payload: {
      property: 'showChildrenInCustody',
      value: false,
      update: updateActiveItem,
    },
  })
})

it.each([false, true])(
  'defaults child source checkboxes to checked with read-only=%s',
  (isReadOnly) => {
    const { controlDispatch, updateActiveItem } = renderSettings(
      { familyType: FamilyTypes.CHILD },
      isReadOnly,
    )

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
    expect(checkboxes).toHaveLength(2)
    checkboxes.forEach((checkbox, index) => {
      expect(checkbox.checked).toBe(true)
      expect(checkbox.disabled).toBe(isReadOnly)
      if (!isReadOnly) {
        fireEvent.click(checkbox)
        expect(controlDispatch).toHaveBeenCalledWith({
          type: 'SET_ANY_FIELD_SETTING',
          payload: {
            property: ['showBiologicalChildren', 'showChildrenInCustody'][
              index
            ],
            value: false,
            update: updateActiveItem,
          },
        })
      }
    })
  },
)

it('allows enabling child sources that were explicitly disabled', () => {
  const { controlDispatch, updateActiveItem } = renderSettings({
    familyType: FamilyTypes.CHILD,
    showBiologicalChildren: false,
    showChildrenInCustody: false,
  })

  const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
  checkboxes.forEach((checkbox, index) => {
    expect(checkbox.checked).toBe(false)
    fireEvent.click(checkbox)
    expect(controlDispatch).toHaveBeenCalledWith({
      type: 'SET_ANY_FIELD_SETTING',
      payload: {
        property: ['showBiologicalChildren', 'showChildrenInCustody'][index],
        value: true,
        update: updateActiveItem,
      },
    })
  })
})

it.each([
  FamilyTypes.APPLICANT_INFO,
  FamilyTypes.SPOUSE,
  FamilyTypes.NATIONAL_ID_ESTATE,
])('hides child source settings for %s', (familyType) => {
  renderSettings({ familyType })

  expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
})

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
