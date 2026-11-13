import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { NavbarSelectStatus } from '../../lib/utils/interfaces'
import { NavComponent } from './NavComponent'

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
  Checkbox: () => null,
  Icon: () => null,
}))

const renderItem = (field: FormSystemField, active: boolean) =>
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
      <NavComponent type="Field" data={field} active={active} />
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
