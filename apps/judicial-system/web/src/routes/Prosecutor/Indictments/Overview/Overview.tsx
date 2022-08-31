import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  FormContentContainer,
  InfoCard,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { core, titles } from '@island.is/judicial-system-web/messages'
import { Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'

import * as strings from './Overview.strings'

const Overview: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={IndictmentsProsecutorSubsections.OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.overview)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.overview.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: formatMessage(strings.overview.indictmentCreated),
                value: formatDate(workingCase.created, 'PP'),
              },
              {
                title: formatMessage(strings.overview.prosecutor),
                value: `${workingCase.creatingProsecutor?.institution?.name}`,
              },
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumbers.join(', '),
              },
              {
                title: formatMessage(core.court),
                value: workingCase.court?.name,
              },
              {
                title: formatMessage(strings.overview.caseType),
                value: capitalize(caseTypes[workingCase.type]),
              },
            ]}
            defendants={
              workingCase.defendants
                ? {
                    title: capitalize(
                      workingCase.defendants.length > 1
                        ? formatMessage(core.indictmentDefendants)
                        : formatMessage(core.indictmentDefendant, {
                            gender: workingCase.defendants[0].gender,
                          }),
                    ),
                    items: workingCase.defendants,
                  }
                : undefined
            }
          />
        </Box>
      </FormContentContainer>
    </PageLayout>
  )
}

export default Overview
