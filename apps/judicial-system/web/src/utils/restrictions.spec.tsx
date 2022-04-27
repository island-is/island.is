import React from 'react'
import { IntlFormatters, useIntl } from 'react-intl'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, getDefaultNormalizer } from '@testing-library/react'

import {
  CaseCustodyRestrictions,
  CaseType,
} from '@island.is/judicial-system/types'
import { LocaleProvider } from '@island.is/localization'

import { formatRequestedCustodyRestrictions } from './restrictions'

interface Props {
  getMessage: (formatMessage: IntlFormatters['formatMessage']) => string
}

const Message: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const messageFormatted = props.getMessage(formatMessage)
  return <span>{messageFormatted}</span>
}

describe('formatRequestedCustodyRestrictions', () => {
  const normalizer = getDefaultNormalizer({
    collapseWhitespace: false,
    trim: false,
  })

  const renderMessage = (getMessage: Props['getMessage']) => {
    return render(
      <MockedProvider>
        <LocaleProvider>
          <Message getMessage={getMessage} />
        </LocaleProvider>
      </MockedProvider>,
    )
  }

  test('should return a comma separated list of restrictions', async () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]

    // Act
    renderMessage((formatMesage) =>
      formatRequestedCustodyRestrictions(
        formatMesage,
        type,
        requestedCustodyRestrictions,
      ),
    )

    // Assert
    expect(
      await screen.findByText('B - Einangrun\nD - Bréfskoðun, símabann', {
        normalizer,
      }),
    ).toBeInTheDocument()
  })

  test('should return "Ekki er farið fram á takmarkanir á gæslu" if no custody restriction is supplied', async () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = []

    // Act
    renderMessage((formatMesage) =>
      formatRequestedCustodyRestrictions(
        formatMesage,
        type,
        requestedCustodyRestrictions,
      ),
    )

    // Assert
    expect(
      await screen.findByText('Ekki er farið fram á takmarkanir á gæslu.'),
    ).toBeInTheDocument()
  })

  test('should return "Ekki er farið fram á takmarkanir á farbanni" if no custody restriction is supplied', async () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = []

    // Act
    renderMessage((formatMesage) =>
      formatRequestedCustodyRestrictions(
        formatMesage,
        type,
        requestedCustodyRestrictions,
      ),
    )

    // Assert
    expect(
      await screen.findByText('Ekki er farið fram á takmarkanir á farbanni.'),
    ).toBeInTheDocument()
  })

  test('should return "Ekki er farið fram á takmarkanir á vistun" if no custody restriction is supplied', async () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = []

    // Act
    renderMessage((formatMesage) =>
      formatRequestedCustodyRestrictions(
        formatMesage,
        type,
        requestedCustodyRestrictions,
      ),
    )

    // Assert
    expect(
      await screen.findByText('Ekki er farið fram á takmarkanir á vistun.'),
    ).toBeInTheDocument()
  })

  test('should return additional other restrictions', async () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]
    const requestedOtherRestrictions = 'The accused should stay home.'

    // Act
    renderMessage((formatMesage) =>
      formatRequestedCustodyRestrictions(
        formatMesage,
        type,
        requestedCustodyRestrictions,
        requestedOtherRestrictions,
      ),
    )

    // Assert
    expect(
      await screen.findByText(
        'B - Einangrun\nD - Bréfskoðun, símabann\nThe accused should stay home.',
        { normalizer },
      ),
    ).toBeInTheDocument()
  })

  test('should return additional other restrictions only', async () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedOtherRestrictions = 'The accused should stay home.'

    // Act
    renderMessage((formatMesage) =>
      formatRequestedCustodyRestrictions(
        formatMesage,
        type,
        undefined,
        requestedOtherRestrictions,
      ),
    )

    // Assert
    expect(
      await screen.findByText('The accused should stay home.'),
    ).toBeInTheDocument()
  })
})
