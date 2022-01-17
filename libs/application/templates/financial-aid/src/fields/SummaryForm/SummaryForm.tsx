import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import DescriptionText from '../DescriptionText/DescriptionText'

import * as m from '../../lib/messages'
import SummaryBlock from '../SummaryBlock/SummaryBlock'
import { FAFieldBaseProps } from '../../lib/types'
import {
  getEmploymentStatus,
  getHomeCircumstances,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'

const SummaryForm = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  console.log(
    getHomeCircumstances[answers?.homeCircumstances?.type as HomeCircumstances],
  )

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        marginTop={[2, 2, 4]}
      >
        <Box marginRight={1}>
          <Text as="h3" variant="h3">
            {formatMessage(m.summaryForm.general.descriptionTitle)}
          </Text>
        </Box>

        <Text variant="small">
          {formatMessage(m.summaryForm.general.descriptionSubtitle)}
        </Text>
      </Box>

      <Box marginTop={2}>
        <DescriptionText text={m.summaryForm.general.description} />
      </Box>

      <Box marginTop={2}>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      {/* <Box marginTop={[3, 3, 4]}>
        <Divider />
      </Box> */}

      <SummaryBlock
        sectionTitle={formatMessage(
          m.homeCircumstancesForm.general.sectionTitle,
        )}
        answer={
          answers?.homeCircumstances?.custom
            ? answers?.homeCircumstances?.custom
            : getHomeCircumstances[answers?.homeCircumstances?.type]
        }
      />

      <SummaryBlock
        sectionTitle={formatMessage(m.incomeForm.general.sectionTitle)}
        answer={answers.income}
      />

      <SummaryBlock
        sectionTitle={formatMessage(m.employmentForm.general.sectionTitle)}
        answer={
          answers?.employment?.custom
            ? answers?.homeCircumstances?.custom
            : getEmploymentStatus[answers?.employment?.type]
        }
      />

      <SummaryBlock
        sectionTitle={formatMessage(m.employmentForm.general.sectionTitle)}
        answer={
          answers?.employment?.custom
            ? answers?.homeCircumstances?.custom
            : getEmploymentStatus[answers?.employment?.type]
        }
      />
    </>
  )
}

export default SummaryForm
