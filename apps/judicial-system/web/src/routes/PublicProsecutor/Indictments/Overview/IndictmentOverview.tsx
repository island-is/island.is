import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Option, Select, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useProsecutorSelectionUsersQuery } from '@island.is/judicial-system-web/src/components/ProsecutorSelection/prosecutorSelectionUsers.generated'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './IndictmentOverview.strings'

export const IndictmentOverview = () => {
  const router = useRouter()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage: fm } = useIntl()
  const { user } = useContext(UserContext)
  const { updateCase } = useCase()
  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] = useState<
    Option<string> | undefined
  >()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useEffect(() => {
    setSelectedIndictmentReviewer(
      workingCase.indictmentReviewer?.id
        ? {
            label: workingCase.indictmentReviewer?.name ?? '',
            value: workingCase.indictmentReviewer?.id,
          }
        : undefined,
    )
  }, [workingCase.indictmentReviewer])

  const assignReviewer = async () => {
    if (!selectedIndictmentReviewer) {
      return
    }
    const updatedCase = await updateCase(workingCase.id, {
      indictmentReviewerId: selectedIndictmentReviewer.value,
    })
    if (!updatedCase) {
      return
    }

    setModalVisible(true)
  }

  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  const { data, loading } = useProsecutorSelectionUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const publicProsecutors = useMemo(() => {
    if (!data?.users || !user) {
      return []
    }

    return data.users
      .filter(
        (prosecutors) => prosecutors.institution?.id === user?.institution?.id,
      )
      .map(({ id, name }) => ({
        label: name ?? '',
        value: id,
      }))
  }, [data?.users, user])

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={fm(titles.shared.closedCaseOverview, {
          courtCaseNumber: workingCase.courtCaseNumber,
        })}
      />
      <FormContentContainer>
        <PageTitle>{fm(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCardClosedIndictment />
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
        <Box marginBottom={5}>
          <SectionHeading
            title={fm(strings.reviewerTitle)}
            description={
              <Text variant="eyebrow">
                {fm(strings.reviewerSubtitle, {
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
              label={fm(strings.reviewerLabel)}
              placeholder={fm(strings.reviewerPlaceholder)}
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
      </FormContentContainer>

      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.CASES_ROUTE}`}
          nextIsLoading={isLoadingWorkingCase}
          nextIsDisabled={!selectedIndictmentReviewer || isLoadingWorkingCase}
          onNextButtonClick={assignReviewer}
          nextButtonText={fm(core.continue)}
        />
      </FormContentContainer>

      {modalVisible && (
        <Modal
          title={fm(strings.reviewerAssignedModalTitle)}
          text={fm(strings.reviewerAssignedModalText, {
            caseNumber: workingCase.courtCaseNumber,
            reviewer: selectedIndictmentReviewer?.label,
          })}
          secondaryButtonText={fm(core.back)}
          onSecondaryButtonClick={() => router.push(constants.CASES_ROUTE)}
        />
      )}
    </PageLayout>
  )
}

export default IndictmentOverview
