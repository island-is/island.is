import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ReactNode, useState } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { NavbarSelectStatus } from '../../lib/utils/interfaces'
import { NavComponent } from './NavComponent'
import { NavbarSelect } from '../NavbarSelect/NavbarSelect'
import { IskSettings } from '../MainContent/components/FieldContent/components/FieldSettings/components/IskSettings'

jest.mock('../MainContent/MainContent.css', () => ({
  identifierToggle: 'toggle',
}))
jest.mock('./NavComponent.css', () => ({
  navComponent: {},
  navBackgroundActive: {},
  navBackgroundDefault: {},
}))
jest.mock('./components/NavButtons', () => ({ NavButtons: () => null }))
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({ attributes: {}, listeners: {}, isDragging: false }),
}))
jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children, title }: { children: ReactNode; title?: string }) => (
    <div title={title}>{children}</div>
  ),
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  Checkbox: ({
    label,
    ariaLabel,
    checked,
    disabled,
    onChange,
  }: {
    label?: string
    ariaLabel?: string
    checked: boolean
    disabled?: boolean
    onChange?: () => void
  }) => (
    <input
      type="checkbox"
      aria-label={ariaLabel ?? label}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  ),
  ToggleSwitchCheckbox: ({
    label,
    checked,
    disabled,
    onChange,
  }: {
    label: string
    checked: boolean
    disabled?: boolean
    onChange: (checked: boolean) => void
  }) => (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
    />
  ),
  GridColumn: ({ children }: { children: ReactNode }) => <>{children}</>,
  GridRow: ({ children }: { children: ReactNode }) => <>{children}</>,
  Button: ({ children }: { children: ReactNode }) => (
    <button>{children}</button>
  ),
  Icon: () => null,
}))

const createField = (field: Partial<FormSystemField>): FormSystemField => ({
  id: 'field',
  fieldType: FieldTypesEnum.TEXTBOX,
  name: { is: '' },
  screenId: 'screen',
  isRequired: false,
  isPartOfMultiset: false,
  ...field,
})

const renderItem = (field: Partial<FormSystemField>, active: boolean) =>
  render(
    <ControlContext.Provider
      value={
        {
          control: { form: {}, isReadOnly: true },
          selectStatus: NavbarSelectStatus.OFF,
          openComponents: { sections: [], screens: [] },
        } as unknown as React.ContextType<typeof ControlContext>
      }
    >
      <NavComponent type="Field" data={createField(field)} active={active} />
    </ControlContext.Provider>,
  )

describe.each([false, true])('navigation with active=%s', (active) => {
  it.each(['', '   ', undefined])(
    'uses the description when the message name is %s',
    (name) => {
      renderItem(
        {
          id: 'message',
          fieldType: FieldTypesEnum.MESSAGE,
          name: { is: name },
          description: { is: 'Message description' },
        },
        active,
      )

      expect(screen.getByText('Message description')).toBeTruthy()
      expect(screen.getByTitle('Message description')).toBeTruthy()
    },
  )

  it('strips formatting and decodes entities in the fallback', () => {
    renderItem(
      {
        id: 'message',
        fieldType: FieldTypesEnum.MESSAGE,
        description: {
          is: '<em>Formatted</em> <strong>message</strong> &amp; text',
        },
      },
      active,
    )

    expect(screen.getByText('Formatted message & text')).toBeTruthy()
    expect(screen.getByTitle('Formatted message & text')).toBeTruthy()
  })

  it('keeps the message name when present', () => {
    renderItem(
      {
        id: 'message',
        fieldType: FieldTypesEnum.MESSAGE,
        name: { is: 'Message name' },
        description: { is: 'Message description' },
      },
      active,
    )

    expect(screen.getByText('Message name')).toBeTruthy()
    expect(screen.queryByText('Message description')).toBeNull()
  })

  it('does not use description fallback for other field types', () => {
    renderItem(
      {
        id: 'text',
        fieldType: FieldTypesEnum.TEXTBOX,
        name: { is: '' },
        description: { is: 'Text description' },
      },
      active,
    )

    expect(screen.queryByText('Text description')).toBeNull()
  })
})

const renderSumSelection = (fieldsToSum: string[] = [], isReadOnly = false) => {
  const controlDispatch = jest.fn()
  const updateActiveItem = jest.fn()
  const Form = () => {
    const [selectStatus, setSelectStatus] = useState(NavbarSelectStatus.OFF)
    const [openComponents, setOpenComponents] = useState({
      sections: ['section'],
      screens: ['screen', 'other-screen'],
    })
    const currentItem = createField({
      id: 'sum',
      screenId: 'screen',
      fieldType: FieldTypesEnum.ISK_SUMBOX,
      fieldSettings: { fieldsToSum },
    })
    const fields: FormSystemField[] = [
      createField({
        id: 'before',
        screenId: 'screen',
        fieldType: FieldTypesEnum.ISK_NUMBERBOX,
        name: { is: 'Before sum' },
      }),
      currentItem,
      createField({
        id: 'after',
        screenId: 'screen',
        fieldType: FieldTypesEnum.ISK_NUMBERBOX,
        name: { is: 'After sum' },
      }),
      createField({
        id: 'text',
        screenId: 'screen',
        fieldType: FieldTypesEnum.TEXTBOX,
      }),
      createField({
        id: 'other',
        screenId: 'other-screen',
        fieldType: FieldTypesEnum.ISK_NUMBERBOX,
      }),
    ]

    return (
      <ControlContext.Provider
        value={
          {
            control: {
              activeItem: { type: 'Field', data: currentItem },
              isReadOnly,
              form: {
                fields,
                sections: [{ id: 'section', sectionType: SectionTypes.INPUT }],
                screens: [
                  { id: 'screen', sectionId: 'section' },
                  { id: 'other-screen', sectionId: 'section' },
                ],
                dependencies: [{ parentProp: 'sum', childProps: ['text'] }],
              },
            },
            selectStatus,
            setSelectStatus,
            openComponents,
            setOpenComponents,
            controlDispatch,
            updateActiveItem,
          } as unknown as React.ContextType<typeof ControlContext>
        }
      >
        <IskSettings />
        {selectStatus === NavbarSelectStatus.OFF ? (
          fields.map((field) => (
            <NavComponent
              key={field.id}
              type="Field"
              data={field}
              active={field.id === currentItem.id}
            />
          ))
        ) : (
          <NavbarSelect />
        )}
      </ControlContext.Provider>
    )
  }
  render(<Form />)
  return { controlDispatch, updateActiveItem }
}

it('selects currency fields before and after the sum only on the same screen', () => {
  const { controlDispatch, updateActiveItem } = renderSumSelection()
  fireEvent.click(
    screen.getByRole('checkbox', { name: /^Velja reiti í samtölu/ }),
  )

  expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Before sum' }))

  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'SET_ANY_FIELD_SETTING',
    payload: {
      property: 'fieldsToSum',
      value: ['before'],
      update: updateActiveItem,
    },
  })
  expect(screen.getByRole('checkbox', { name: 'After sum' })).toBeTruthy()
})

it('shows saved selections and removes an unchecked field ID', () => {
  const { controlDispatch, updateActiveItem } = renderSumSelection([
    'before',
    'after',
  ])
  fireEvent.click(
    screen.getByRole('checkbox', { name: /^Velja reiti í samtölu/ }),
  )

  const checkbox = screen.getByRole('checkbox', {
    name: 'Before sum',
  }) as HTMLInputElement
  expect(checkbox.checked).toBe(true)
  fireEvent.click(checkbox)

  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'SET_ANY_FIELD_SETTING',
    payload: {
      property: 'fieldsToSum',
      value: ['after'],
      update: updateActiveItem,
    },
  })
})

it('shows checked indicators for saved sum fields without entering selection mode', () => {
  const { controlDispatch } = renderSumSelection([
    'before',
    'after',
    'text',
    'other',
  ])

  for (const name of ['Before sum', 'After sum']) {
    const checkbox = screen.getByRole('checkbox', {
      name,
    }) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
    expect(checkbox.disabled).toBe(true)
  }
  expect(screen.getAllByRole('checkbox')).toHaveLength(4)
  expect(controlDispatch).not.toHaveBeenCalled()
})

it('does not mark currency fields when no IDs are selected', () => {
  renderSumSelection()

  expect(screen.queryByRole('checkbox', { name: 'Before sum' })).toBeNull()
  expect(screen.queryByRole('checkbox', { name: 'After sum' })).toBeNull()
})

it('leaves selection mode showing saved field IDs as checked indicators', () => {
  const { controlDispatch } = renderSumSelection(['before'])
  const toggle = screen.getByRole('checkbox', {
    name: /^Velja reiti í samtölu/,
  })
  fireEvent.click(toggle)
  fireEvent.click(toggle)

  const checkbox = screen.getByRole('checkbox', {
    name: 'Before sum',
  }) as HTMLInputElement
  expect(checkbox.checked).toBe(true)
  expect(checkbox.disabled).toBe(true)
  expect(controlDispatch).not.toHaveBeenCalled()
})

it('disables sum field selection for read-only forms', () => {
  renderSumSelection([], true)

  expect(
    (
      screen.getByRole('checkbox', {
        name: /^Velja reiti í samtölu/,
      }) as HTMLInputElement
    ).disabled,
  ).toBe(true)
})
