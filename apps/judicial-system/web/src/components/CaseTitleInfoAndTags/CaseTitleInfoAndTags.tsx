import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'

import { CaseAppealDecision, UserRole } from '../../graphql/schema'
import { FormContext } from '../FormProvider/FormProvider'
import OverviewHeader from '../OverviewHeader/OverviewHeader'
import RestrictionTags from '../RestrictionTags/RestrictionTags'
import RulingDateLabel from '../RulingDateLabel/RulingDateLabel'
import { CaseTitleInfoAndTags as strings } from './CaseTitleInfoAndTags.strings'

const CaseTitleInfoAndTags: React.FC = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  return (
    <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
      <Box>
        <OverviewHeader />
        {workingCase.rulingDate && (
          <RulingDateLabel rulingDate={workingCase.rulingDate} />
        )}
        {workingCase.appealedDate && (
          <Box marginTop={1}>
            <Text as="h5" variant="h5">
              {workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.APPEAL ||
              workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
                ? formatMessage(strings.appealedByInCourt, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                  })
                : formatMessage(strings.appealedBy, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                    appealedDate: `${formatDate(
                      workingCase.appealedDate,
                      'PPPp',
                    )}`,
                  })}
            </Text>
          </Box>
        )}
      </Box>
      <Box display="flex" flexDirection="column">
        <RestrictionTags workingCase={workingCase} />
      </Box>
    </Box>
  )
}

export default CaseTitleInfoAndTags
