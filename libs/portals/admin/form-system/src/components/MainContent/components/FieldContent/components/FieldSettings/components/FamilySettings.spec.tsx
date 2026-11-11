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
