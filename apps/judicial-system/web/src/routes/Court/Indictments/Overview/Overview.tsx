import { FC, useCallback, useContext, useState } from 'react'
import { IntlShape, MessageDescriptor, useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion, AlertMessage, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { type Lawyer } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  ConnectedCaseFilesAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentCaseScheduledCard,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  useIndictmentsLawsBroken,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentDecision,
  ServiceStatus,
  Subpoena,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useDefendants,
  useGetLawyer,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { SubpoenaType } from '../../components'
import ReturnIndictmentModal from '../ReturnIndictmentCaseModal/ReturnIndictmentCaseModal'
import { strings } from './Overview.strings'

const mapServiceStatusTitle = (
  serviceStatus?: ServiceStatus | null,
): MessageDescriptor => {
  switch (serviceStatus) {
    case ServiceStatus.DEFENDER:
    case ServiceStatus.ELECTRONICALLY:
    case ServiceStatus.IN_PERSON:
      return strings.serviceStatusSuccess
    case ServiceStatus.EXPIRED:
      return strings.serviceStatusExpired
    case ServiceStatus.FAILED:
      return strings.serviceStatusFailed
    // Should not happen
    default:
      return strings.serviceStatusUnknown
  }
}

const mapServiceStatusMessages = (
  subpoena: Subpoena,
  formatMessage: IntlShape['formatMessage'],
  lawyer?: Lawyer,
) => {
  switch (subpoena.serviceStatus) {
    case ServiceStatus.DEFENDER:
      return [
        `${subpoena.servedBy} - ${formatDate(subpoena.serviceDate, 'Pp')}`,
        formatMessage(strings.servedToDefender, {
          lawyerName: lawyer?.name,
          practice: lawyer?.practice,
        }),
      ]
    case ServiceStatus.ELECTRONICALLY:
      return [
        formatMessage(strings.servedToElectronically, {
          date: formatDate(subpoena.serviceDate, 'Pp'),
        }),
      ]
    case ServiceStatus.IN_PERSON:
    case ServiceStatus.FAILED:
      return [
        `${subpoena.servedBy} - ${formatDate(subpoena.serviceDate, 'Pp')}`,
        subpoena.comment,
      ]
    case ServiceStatus.EXPIRED:
      return [formatMessage(strings.serviceStatusExpiredMessage)]
    default:
      return []
  }
}

interface ServiceAnnouncement {
  subpoena: Subpoena
  defendantName?: string | null
}

const ServiceAnnouncement: FC<ServiceAnnouncement> = (props) => {
  const { subpoena, defendantName } = props

  const { formatMessage } = useIntl()

  const lawyer = useGetLawyer(
    subpoena.defenderNationalId,
    subpoena.serviceStatus === ServiceStatus.DEFENDER,
  )

  const title = mapServiceStatusTitle(subpoena.serviceStatus)
  const messages = mapServiceStatusMessages(subpoena, formatMessage, lawyer)

  return !defendantName ? null : (
    <Box marginBottom={2}>
      <AlertMessage
        title={`${formatMessage(title)} - ${defendantName}`}
        message={
          <Box>
            {messages.map((msg) => (
              <Text variant="small" key={`${msg}-${subpoena.created}`}>
                {msg}
              </Text>
            ))}
          </Box>
        }
        type={
          subpoena.serviceStatus === ServiceStatus.FAILED ||
          subpoena.serviceStatus === ServiceStatus.EXPIRED
            ? 'warning'
            : 'success'
        }
      />
    </Box>
  )
}

const IndictmentOverview = () => {
  const router = useRouter()
  const { workingCase, isLoadingWorkingCase, caseNotFound, setWorkingCase } =
    useContext(FormContext)
  const { updateDefendantState, updateDefendant } = useDefendants()

  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const [modalVisible, setModalVisible] = useState<'RETURN_INDICTMENT'>()

  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const isArraignmentScheduled = Boolean(workingCase.arraignmentDate)
  // const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (workingCase.defendants) {
        const promises = workingCase.defendants.map((defendant) =>
          updateDefendant({
            caseId: workingCase.id,
            defendantId: defendant.id,
            subpoenaType: defendant.subpoenaType,
          }),
        )

        const allDataSentToServer = await Promise.all(promises)

        if (!allDataSentToServer.every(Boolean)) {
          return
        }
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [router, updateDefendant, workingCase.defendants, workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.overview)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.inProgressTitle)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.defendants?.map((defendant) =>
          defendant.subpoenas?.map((subpoena) => (
            <ServiceAnnouncement
              key={`${subpoena.id}-${subpoena.created}`}
              subpoena={subpoena}
              defendantName={defendant.name}
            />
          )),
        )}
        {workingCase.court &&
          latestDate?.date &&
          workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
          workingCase.indictmentDecision !==
            IndictmentDecision.REDISTRIBUTING && (
            <Box component="section" marginBottom={5}>
              <IndictmentCaseScheduledCard
                court={workingCase.court}
                indictmentDecision={workingCase.indictmentDecision}
                courtDate={latestDate.date}
                courtRoom={latestDate.location}
                postponedIndefinitelyExplanation={
                  workingCase.postponedIndefinitelyExplanation
                }
                courtSessionType={workingCase.courtSessionType}
              />
            </Box>
          )}
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment />
        </Box>
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )}
        {workingCase.mergedCases && workingCase.mergedCases.length > 0 && (
          <Accordion>
            {workingCase.mergedCases.map((mergedCase) => (
              <Box marginBottom={5} key={mergedCase.id}>
                <ConnectedCaseFilesAccordionItem
                  connectedCaseParentId={workingCase.id}
                  connectedCase={mergedCase}
                />
              </Box>
            ))}
          </Accordion>
        )}
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={10}>
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
        {workingCase.defendants && (
          <Box component="section" marginBottom={5}>
            {
              <SubpoenaType
                subpoenaItems={workingCase.defendants.map((defendant) => ({
                  defendant,
                  disabled: isArraignmentScheduled,
                }))}
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                updateDefendantState={updateDefendantState}
                required={false}
              />
            }
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.CASES_ROUTE}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() =>
            handleNavigationTo(
              constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
            )
          }
          nextButtonText={formatMessage(core.continue)}
          /* 
            The return indictment feature has been removed for the time being but
            we want to hold on to the functionality for now, since we are likely
            to change this feature in the future.
          */
          // actionButtonText={formatMessage(strings.returnIndictmentButtonText)}
          // actionButtonColorScheme={'destructive'}
          // actionButtonIsDisabled={!caseHasBeenReceivedByCourt}
          // onActionButtonClick={() => setModalVisible('RETURN_INDICTMENT')}
        />
      </FormContentContainer>
      {modalVisible === 'RETURN_INDICTMENT' && (
        <ReturnIndictmentModal
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          onClose={() => setModalVisible(undefined)}
          onComplete={() => router.push(constants.CASES_ROUTE)}
        />
      )}
    </PageLayout>
  )
}

export default IndictmentOverview
