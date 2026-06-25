import { render, screen } from '@testing-library/react'

import {
  Case,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import Decision from './Decision'

describe('Decision', () => {
  test('groups the decision radios in a named fieldset', () => {
    render(
      <Decision
        workingCase={{ type: CaseType.CUSTODY } as Case}
        acceptedLabelText="Samþykkja"
        rejectedLabelText="Hafna"
        partiallyAcceptedLabelText="Samþykkja að hluta"
        dismissLabelText="Vísa frá"
        onChange={jest.fn()}
      />,
    )

    // The radios are exposed as a single group with a (visually hidden) name.
    const group = screen.getByRole('group', { name: 'Lyktir máls' })
    expect(group.tagName).toBe('FIELDSET')

    expect(screen.getByRole('radio', { name: 'Samþykkja' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Hafna' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Vísa frá' })).toBeInTheDocument()
  })
})
