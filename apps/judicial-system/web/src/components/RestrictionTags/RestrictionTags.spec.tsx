import React from 'react'
import { render, screen } from '@testing-library/react'

import {
  CaseCustodyRestrictions,
  CaseDecision,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

import RestrctionTags from './RestrictionTags'

const renderRestrictionTags = (workingCase: Case) =>
  render(<RestrctionTags workingCase={workingCase} />)

describe('<RestrictionTags />', () => {
  const selector = { selector: 'span' }
  test('should not render for investication cases', () => {
    const theCase = { type: CaseType.BodySearch } as Case
    const result = renderRestrictionTags(theCase)

    expect(result.container).toBeEmptyDOMElement()
  })

  test('should render isolation restrction when isCustodyIsolation=true', () => {
    const theCase = {
      isCustodyIsolation: true,
      decision: CaseDecision.ACCEPTING,
    } as Case
    renderRestrictionTags(theCase)

    expect(screen.getByText('Einangrun', selector)).toBeInTheDocument()
  })

  test('should not render isolation restrction when decision not accepting', () => {
    const theCase = {
      isCustodyIsolation: true,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
    } as Case
    renderRestrictionTags(theCase)

    expect(screen.queryByText('Einangrun', selector)).toBeNull()
  })

  test('should render tags for accepted travel ban cases', () => {
    const theCase = {
      type: CaseType.TravelBan,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.getByText('Tilkynningarskylda', selector)).toBeInTheDocument()

    expect(screen.queryByText('Fjölmiðlabann', selector)).toBeNull()
    expect(screen.queryByText('Vinnubann', selector)).toBeNull()
  })

  test('should render tags for accepted travel ban cases', () => {
    const theCase = {
      type: CaseType.TravelBan,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.NECESSITIES,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.getByText('Tilkynningarskylda', selector)).toBeInTheDocument()

    expect(screen.queryByText('Bréfskoðun, símabann', selector)).toBeNull()
    expect(screen.queryByText('Einangrun', selector)).toBeNull()
    expect(screen.queryByText('Fjölmiðlabann', selector)).toBeNull()
    expect(screen.queryByText('Eigin nauðsynjar', selector)).toBeNull()
    expect(screen.queryByText('Heimsóknarbann', selector)).toBeNull()
    expect(screen.queryByText('Vinnubann', selector)).toBeNull()
  })

  test('should render tags for accepted custody cases', () => {
    const theCase = {
      type: CaseType.Custody,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.NECESSITIES,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.queryByText('Tilkynningarskylda', selector)).toBeNull()
    expect(screen.queryByText('Einangrun', selector)).toBeNull()

    expect(
      screen.getByText('Bréfskoðun, símabann', selector),
    ).toBeInTheDocument()
    expect(screen.getByText('Fjölmiðlabann', selector)).toBeInTheDocument()
    expect(screen.getByText('Eigin nauðsynjar', selector)).toBeInTheDocument()
    expect(screen.getByText('Heimsóknarbann', selector)).toBeInTheDocument()
    expect(screen.getByText('Vinnubann', selector)).toBeInTheDocument()
  })

  test('should render tags for accepted admission cases', () => {
    const theCase = {
      type: CaseType.AdmissionToFacility,
      decision: CaseDecision.ACCEPTING,
      requestedCustodyRestrictions: [
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
        CaseCustodyRestrictions.COMMUNICATION,
        CaseCustodyRestrictions.ISOLATION,
        CaseCustodyRestrictions.MEDIA,
        CaseCustodyRestrictions.NECESSITIES,
        CaseCustodyRestrictions.VISITAION,
        CaseCustodyRestrictions.WORKBAN,
      ],
    } as Case

    renderRestrictionTags(theCase)

    expect(screen.queryByText('Tilkynningarskylda', selector)).toBeNull()

    expect(
      screen.getByText('Bréfskoðun, símabann', selector),
    ).toBeInTheDocument()
    expect(screen.getByText('Fjölmiðlabann', selector)).toBeInTheDocument()
    expect(screen.getByText('Eigin nauðsynjar', selector)).toBeInTheDocument()
    expect(screen.getByText('Heimsóknarbann', selector)).toBeInTheDocument()
    expect(screen.getByText('Vinnubann', selector)).toBeInTheDocument()
  })
})
