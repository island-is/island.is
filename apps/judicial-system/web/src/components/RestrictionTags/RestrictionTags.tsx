import React from 'react'

import { Box, Tag } from '@island.is/island-ui/core'
import {
  CaseCustodyRestrictions,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { getRestrictionTagVariant } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { getShortRestrictionByValue } from '@island.is/judicial-system/formatters'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  workingCase: Case
}

const RestrictionTags: React.FC<Props> = (props) => {
  const { workingCase } = props

  return (
    <>
      {isAcceptingCaseDecision(workingCase.decision) &&
        workingCase.isCustodyIsolation && (
          <Box marginBottom={1}>
            <Tag
              variant={getRestrictionTagVariant(
                CaseCustodyRestrictions.ISOLATION,
              )}
              outlined
              disabled
            >
              {getShortRestrictionByValue(CaseCustodyRestrictions.ISOLATION)}
            </Tag>
          </Box>
        )}
      {
        // Custody restrictions
        (workingCase.type === CaseType.Custody ||
          workingCase.type === CaseType.AdmissionToFacility) &&
          isAcceptingCaseDecision(workingCase.decision) &&
          workingCase.requestedCustodyRestrictions
            ?.filter((restriction) =>
              [
                CaseCustodyRestrictions.VISITAION,
                CaseCustodyRestrictions.COMMUNICATION,
                CaseCustodyRestrictions.MEDIA,
                CaseCustodyRestrictions.WORKBAN,
                CaseCustodyRestrictions.NECESSITIES,
              ].includes(restriction),
            )
            ?.map((custodyRestriction, index) => (
              <Box marginTop={index > 0 ? 1 : 0} key={index}>
                <Tag
                  variant={getRestrictionTagVariant(custodyRestriction)}
                  outlined
                  disabled
                >
                  {getShortRestrictionByValue(custodyRestriction)}
                </Tag>
              </Box>
            ))
      }
      {
        // Travel ban restrictions
        workingCase.type === CaseType.TravelBan &&
          isAcceptingCaseDecision(workingCase.decision) &&
          workingCase.requestedCustodyRestrictions
            ?.filter(
              (restriction) =>
                CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION ===
                restriction,
            )
            ?.map((custodyRestriction, index) => (
              <Box marginTop={index > 0 ? 1 : 0} key={index}>
                <Tag
                  variant={getRestrictionTagVariant(custodyRestriction)}
                  outlined
                  disabled
                >
                  {getShortRestrictionByValue(custodyRestriction)}
                </Tag>
              </Box>
            ))
      }
    </>
  )
}

export default RestrictionTags
