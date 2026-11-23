import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import type { Application, FieldBaseProps } from '@island.is/application/types'
import { SUBMIT_RESULT_ID } from '../utils/constants'
import { CertificateLink } from './CertificateLink'
import { CommentSummary } from './CommentSummary'

jest.mock('@island.is/localization', () => {
  const { createIntl } = jest.requireActual('react-intl')
  const intl = createIntl({ locale: 'is', defaultLocale: 'is' })
  return {
    useLocale: () => ({
      lang: 'is',
      formatMessage: (
        message: { id: string; defaultMessage: string },
        values?: Record<string, unknown>,
      ) => intl.formatMessage(message, values),
    }),
  }
})

const props = (application: Partial<Application>) =>
  ({
    application: { answers: {}, externalData: {}, ...application },
  } as unknown as FieldBaseProps)

const sent = (documentId?: string) => ({
  [SUBMIT_RESULT_ID]: {
    status: 'success' as const,
    date: new Date('2026-11-11T10:00:00Z'),
    data: { caseId: 'case-1', deliveryStatus: 'sent_to_mailbox', documentId },
  },
})

describe('CertificateLink', () => {
  it('links to the document in the mailbox', () => {
    render(
      <CertificateLink
        {...props({
          externalData: {
            ...sent('doc/1 2'),
            nationalRegistry: {
              status: 'success',
              date: new Date(),
              data: { fullName: 'Gervimaður Prófunarson' },
            },
          },
        })}
      />,
    )

    const link = screen.getByRole('link', {
      name: 'Starfsvottorð – Gervimaður Prófunarson / 11.11.2026',
    })
    expect(link).toHaveAttribute('href', '/minarsidur/postholf/doc%2F1%202')
    expect(link).not.toHaveAttribute('target')
    expect(screen.getByText('PDF')).toBeInTheDocument()
  })

  it('falls back to the mailbox and the name in the answers', () => {
    render(
      <CertificateLink
        {...props({
          answers: { applicant: { name: 'Gervimaður Úr Svörum' } },
          externalData: sent(),
        })}
      />,
    )

    const link = screen.getByRole('link', {
      name: /Gervimaður Úr Svörum/,
    })
    expect(link).toHaveAttribute('href', '/minarsidur/postholf')
  })
})

describe('CommentSummary', () => {
  it('shows the comment as plain text', () => {
    render(
      <CommentSummary
        {...props({ answers: { comment: '  **Vantar** [hlekk](x)\nlína 2 ' } })}
      />,
    )

    expect(screen.getByText('Athugasemd þín')).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, el) =>
          el?.textContent === '**Vantar** [hlekk](x)\nlína 2' &&
          el.tagName !== 'DIV',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it.each([undefined, '   '])(
    'shows nothing without a comment (%j)',
    (comment) => {
      const { container } = render(
        <CommentSummary
          {...props({ answers: comment === undefined ? {} : { comment } })}
        />,
      )
      expect(container).toBeEmptyDOMElement()
    },
  )
})
