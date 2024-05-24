import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Option, Select, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { isCompletedCase } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { NameAndEmail } from '@island.is/judicial-system-web/src/components/InfoCard/InfoCard'
import { DefendantsSection } from '@island.is/judicial-system-web/src/components/InfoCards/DefendantsSection/DefendantsSection'
import InfoCard from '@island.is/judicial-system-web/src/components/InfoCards/InfoCard'
import InfoSection from '@island.is/judicial-system-web/src/components/InfoCards/InfoSection/InfoSection'
import { useProsecutorSelectionUsersQuery } from '@island.is/judicial-system-web/src/components/ProsecutorSelection/prosecutorSelectionUsers.generated'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Overview.strings'
type VisibleModal = 'REVIEWER_ASSIGNED' | 'DEFENDANT_VIEWS_VERDICT'

export const Overview = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { updateCase } = useCase()
  const { workingCase, isLoadingWorkingCase, caseNotFound, setWorkingCase } =
    useContext(FormContext)
  const { setAndSendDefendantToServer } = useDefendants()
  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()
  const [modalVisible, setModalVisible] = useState<VisibleModal>()
  const [selectedDefendant, setSelectedDefendant] = useState<Defendant | null>()
  const { data, loading } = useProsecutorSelectionUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const displayReviewerChoices = workingCase.indictmentReviewer === null
  const publicProsecutors = useMemo(() => {
    if (!data?.users || !user) {
      return []
    }
    return data.users.reduce(
      (acc: { label: string; value: string }[], prosecutor) => {
        if (prosecutor.institution?.id === user?.institution?.id) {
          acc.push({
            label: prosecutor.name ?? '',
            value: prosecutor.id,
          })
        }
        return acc
      },
      [],
    )
  }, [data?.users, user])

  const handleAssignReviewer = async () => {
    if (!selectedIndictmentReviewer) {
      return
    }
    const updatedCase = await updateCase(workingCase.id, {
      indictmentReviewerId: selectedIndictmentReviewer.value,
    })
    if (!updatedCase) {
      return
    }

    setModalVisible('REVIEWER_ASSIGNED')
  }
  const handleDefendantViewsVerdict = () => {
    if (!selectedDefendant) {
      return
    }

    const updatedDefendant = {
      caseId: workingCase.id,
      defendantId: selectedDefendant.id,
      verdictViewDate: formatDateForServer(new Date()),
    }

    setAndSendDefendantToServer(updatedDefendant, setWorkingCase)

    setModalVisible(undefined)
  }
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.shared.closedCaseOverview, {
          courtCaseNumber: workingCase.courtCaseNumber,
        })}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCard>
            <DefendantsSection
              defendants={workingCase.defendants}
              actionButton={
                isCompletedCase(workingCase.state)
                  ? {
                      text: formatMessage(strings.displayVerdict),
                      onClick: (defendant) => {
                        setSelectedDefendant(defendant)
                        setModalVisible('DEFENDANT_VIEWS_VERDICT')
                      },
                      icon: 'mailOpen',
                      isDisabled: (defendant) =>
                        defendant.verdictViewDate !== null,
                    }
                  : undefined
              }
            />
            <InfoSection
              data={[
                {
                  title: formatMessage(core.policeCaseNumber),
                  value: workingCase.policeCaseNumbers?.map((n) => (
                    <Text key={n}>{n}</Text>
                  )),
                },
                {
                  title: formatMessage(core.courtCaseNumber),
                  value: workingCase.courtCaseNumber,
                },
                {
                  title: formatMessage(core.prosecutor),
                  value: `${workingCase.prosecutorsOffice?.name}`,
                },
                {
                  title: formatMessage(core.court),
                  value: workingCase.court?.name,
                },
                {
                  title: formatMessage(core.indictmentProsecutor),
                  value: NameAndEmail(
                    workingCase.prosecutor?.name,
                    workingCase.prosecutor?.email,
                  ),
                },
                {
                  title: formatMessage(core.judge),
                  value: NameAndEmail(
                    workingCase.judge?.name,
                    workingCase.judge?.email,
                  ),
                },
                {
                  title: formatMessage(core.offence),
                  value: (
                    <>
                      {readableIndictmentSubtypes(
                        workingCase.policeCaseNumbers,
                        workingCase.indictmentSubtypes,
                      ).map((subtype) => (
                        <Text key={subtype}>{capitalize(subtype)}</Text>
                      ))}
                    </>
                  ),
                },
              ]}
            />
            <InfoSection
              data={[
                {
                  title: formatMessage(strings.indictmentReviewer),
                  value: workingCase.indictmentReviewer?.name,
                },
              ]}
            />
          </InfoCard>
        </Box>
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )}
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={5}>
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
        {displayReviewerChoices && (
          <Box marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.reviewerTitle)}
              description={
                <Text variant="eyebrow">
                  {formatMessage(strings.reviewerSubtitle, {
                    indictmentAppealDeadline: formatDate(
                      workingCase.indictmentAppealDeadline,
                      'P',
                    ),
                  })}
                </Text>
              }
            />
            <BlueBox>
              <Select
                name="reviewer"
                label={formatMessage(strings.reviewerLabel)}
                placeholder={formatMessage(strings.reviewerPlaceholder)}
                value={selectedIndictmentReviewer}
                options={publicProsecutors}
                onChange={(value) => {
                  setSelectedIndictmentReviewer(value as Option<string>)
                }}
                isDisabled={loading}
                required
              />
            </BlueBox>
          </Box>
        )}
      </FormContentContainer>

      {displayReviewerChoices && (
        <FormContentContainer isFooter>
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={`${constants.CASES_ROUTE}`}
            nextIsLoading={isLoadingWorkingCase}
            nextIsDisabled={!selectedIndictmentReviewer || isLoadingWorkingCase}
            onNextButtonClick={handleAssignReviewer}
            nextButtonText={formatMessage(core.continue)}
          />
        </FormContentContainer>
      )}

      {modalVisible === 'REVIEWER_ASSIGNED' && (
        <Modal
          title={formatMessage(strings.reviewerAssignedModalTitle)}
          text={formatMessage(strings.reviewerAssignedModalText, {
            caseNumber: workingCase.courtCaseNumber,
            reviewer: selectedIndictmentReviewer?.label,
          })}
          secondaryButtonText={formatMessage(core.back)}
          onSecondaryButtonClick={() => router.push(constants.CASES_ROUTE)}
        />
      )}

      {modalVisible === 'DEFENDANT_VIEWS_VERDICT' && (
        <Modal
          title={formatMessage(strings.defendantViewsVerdictModalTitle)}
          text={formatMessage(strings.defendantViewsVerdictModalText)}
          primaryButtonText={formatMessage(
            strings.defendantViewsVerdictModalPrimaryButtonText,
          )}
          onPrimaryButtonClick={() => handleDefendantViewsVerdict()}
          secondaryButtonText={formatMessage(core.back)}
          onSecondaryButtonClick={() => setModalVisible(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default Overview
