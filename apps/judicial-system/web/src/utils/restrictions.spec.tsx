import { FC } from 'react'
import { IntlFormatters, useIntl } from 'react-intl'
import { MockedProvider } from '@apollo/client/testing'
import { getDefaultNormalizer, render, screen } from '@testing-library/react'

import {
  CaseCustodyRestrictions,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { LocaleProvider } from '@island.is/localization'

import { formatCustodyRestrictions } from './restrictions'
import { formatRequestedCustodyRestrictions } from './restrictions'
import { createFormatMessage } from './testHelpers.logic'

interface Props {
  getMessage: (formatMessage: IntlFormatters['formatMessage']) => string
}

const Message: FC<Props> = (props) => {
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

describe('formatCustodyRestrictions', () => {
  const formatMessage = createFormatMessage()

  it('should return empty string if no custody restrictions', () => {
    const caseType = CaseType.CUSTODY
    const restrictions = [] as CaseCustodyRestrictions[]

    const res = formatCustodyRestrictions(formatMessage, caseType, restrictions)

    expect(res).toEqual('')
  })

  it('should return empty string if undefined custody restrictions', () => {
    const caseType = CaseType.CUSTODY
    const restrictions = undefined

    const res = formatCustodyRestrictions(formatMessage, caseType, restrictions)

    expect(res).toEqual('')
  })

  it('should return formatted string for custody case with one restrictions', () => {
    const caseType = CaseType.CUSTODY
    const restrictions = [CaseCustodyRestrictions.VISITAION]

    const res = formatCustodyRestrictions(formatMessage, caseType, restrictions)

    expect(res).toEqual(
      'Sækjandi kynnir kærða tilhögun gæsluvarðhaldsins, sem sé með takmörkunum skv. c-lið 1. mgr. 99. gr. laga nr. 88/2008.',
    )
  })

  it('should return formatted string for admission to facility case with two restrictions', () => {
    const caseType = CaseType.ADMISSION_TO_FACILITY
    const restrictions = [
      CaseCustodyRestrictions.VISITAION,
      CaseCustodyRestrictions.NECESSITIES,
    ]

    const res = formatCustodyRestrictions(formatMessage, caseType, restrictions)

    expect(res).toEqual(
      'Sækjandi kynnir kærða tilhögun vistunarinnar, sem sé með takmörkunum skv. a- og c-liðum 1. mgr. 99. gr. laga nr. 88/2008.',
    )
  })

  it('should return formatted string for admission to facility case with tree restrictions', () => {
    const caseType = CaseType.ADMISSION_TO_FACILITY
    const restrictions = [
      CaseCustodyRestrictions.VISITAION,
      CaseCustodyRestrictions.NECESSITIES,
      CaseCustodyRestrictions.MEDIA,
    ]

    const res = formatCustodyRestrictions(formatMessage, caseType, restrictions)

    expect(res).toEqual(
      'Sækjandi kynnir kærða tilhögun vistunarinnar, sem sé með takmörkunum skv. a-, c- og e-liðum 1. mgr. 99. gr. laga nr. 88/2008.',
    )
  })

  it('should filter out non supported restrictions', () => {
    const caseType = CaseType.ADMISSION_TO_FACILITY
    const restrictions = [
      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
      CaseCustodyRestrictions.ISOLATION,
    ]

    const res = formatCustodyRestrictions(formatMessage, caseType, restrictions)

    expect(res).toEqual('')
  })
})
