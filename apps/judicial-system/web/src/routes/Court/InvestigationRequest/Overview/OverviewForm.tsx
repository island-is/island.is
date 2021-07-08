import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { Box, Button, Text } from '@island.is/island-ui/core'
import {
  CaseFileList,
  FormContentContainer,
  FormFooter,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  capitalize,
  caseTypes,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import * as styles from './Overview.treat'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'
import { requestCourtDate } from '@island.is/judicial-system-web/messages'
import CourtCaseNumber from '../../SharedComponents/CourtCaseNumber/CourtCaseNumber'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const OverviewForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState<string>('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] = useState<boolean>(
    false,
  )
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()

  const { user } = useContext(UserContext)
  const { createCourtCase } = useCase()
  const { formatMessage } = useIntl()

  const validations: FormSettings = {
    courtCaseNumber: {
      validations: ['empty'],
    },
  }

  const { isValid } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
  )

  const handleCreateCourtCase = (workingCase: Case) => {
    createCourtCase(workingCase, setWorkingCase, setCourtCaseNumberEM)

    if (courtCaseNumberEM === '') {
      setCreateCourtCaseSuccess(true)
    }
  }

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit kröfu um rannsóknarheimild
          </Text>
        </Box>
        <Box component="section" marginBottom={6}>
          <CourtCaseNumber
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            courtCaseNumberEM={courtCaseNumberEM}
            setCourtCaseNumberEM={setCourtCaseNumberEM}
            createCourtCaseSuccess={createCourtCaseSuccess}
            setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
            handleCreateCourtCase={handleCreateCourtCase}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: 'LÖKE málsnúmer',
                value: workingCase.policeCaseNumber,
              },
              {
                title: 'Krafa stofnuð',
                value: formatDate(workingCase.created, 'P'),
              },
              {
                title: 'Embætti',
                value: `${
                  workingCase.prosecutor?.institution?.name ?? 'Ekki skráð'
                }`,
              },
              {
                title: formatMessage(requestCourtDate.heading),
                value: `${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP', true) ??
                    '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  TIME_FORMAT,
                )}`,
              },
              {
                title: 'Ákærandi',
                value: `${workingCase.prosecutor?.name} ${workingCase.prosecutor?.title}`,
              },
              {
                title: 'Tegund kröfu',
                value: capitalize(caseTypes[workingCase.type]),
              },
            ]}
            accused={workingCase.accused}
            defender={{
              name: workingCase.defenderName ?? '',
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
            }}
            isInvestigationCase
          />
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Efni kröfu
            </Text>
          </Box>
          <Text>{workingCase.description}</Text>
        </Box>
        <Box marginBottom={5} data-testid="demands">
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómkröfur
            </Text>
          </Box>
          <Text>{workingCase.demands}</Text>
        </Box>
        <Box className={styles.infoSection}>
          <Box marginBottom={5}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Lagaákvæði sem brot varða við
              </Text>
            </Box>
            <Text>{workingCase.lawsBroken}</Text>
          </Box>
          <Box marginBottom={5}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Lagaákvæði sem krafan er byggð á
              </Text>
            </Box>
            <Text>{workingCase.legalBasis}</Text>
          </Box>
        </Box>
        {(workingCase.caseFacts || workingCase.legalArguments) && (
          <div className={styles.infoSection}>
            <Box marginBottom={1}>
              <Text variant="h3" as="h2">
                Greinargerð um málsatvik og lagarök
              </Text>
            </Box>
            {workingCase.caseFacts && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="eyebrow" color="blue400">
                    Málsatvik
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.caseFacts}
                  </span>
                </Text>
              </Box>
            )}
            {workingCase.legalArguments && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="eyebrow" color="blue400">
                    Lagarök
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.legalArguments}
                  </span>
                </Text>
              </Box>
            )}
          </div>
        )}
        {(workingCase.comments || workingCase.caseFilesComments) && (
          <div className={styles.infoSection}>
            <Box marginBottom={2}>
              <Text variant="h3" as="h2">
                Athugasemdir
              </Text>
            </Box>
            {workingCase.comments && (
              <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
                <Box marginBottom={1}>
                  <Text variant="h4" as="h3" color="blue400">
                    Athugasemdir vegna málsmeðferðar
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.comments}
                  </span>
                </Text>
              </Box>
            )}
            {workingCase.caseFilesComments && (
              <>
                <Box marginBottom={1}>
                  <Text variant="h4" as="h3" color="blue400">
                    Athugasemdir vegna rannsóknargagna
                  </Text>
                </Box>
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.caseFilesComments}
                  </span>
                </Text>
              </>
            )}
          </div>
        )}
        <div className={styles.infoSection}>
          <Box marginBottom={1}>
            <Text as="h2" variant="h3">
              {`Rannsóknargögn (${
                workingCase.files ? workingCase.files.length : 0
              })`}
            </Text>
          </Box>
          <CaseFileList
            caseId={workingCase.id}
            files={workingCase.files ?? []}
            canOpenFiles={
              workingCase.judge !== null && workingCase.judge?.id === user?.id
            }
          />
        </div>
        <Box marginBottom={10}>
          <Box marginBottom={3}>
            <PdfButton
              caseId={workingCase.id}
              title="Opna PDF kröfu"
              pdfType="request"
            />
          </Box>
          <Button
            variant="ghost"
            icon="pencil"
            size="small"
            onClick={() => setIsDraftingConclusion(true)}
          >
            Skrifa drög að niðurstöðu
          </Button>
        </Box>
        <DraftConclusionModal
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          isDraftingConclusion={isDraftingConclusion}
          setIsDraftingConclusion={setIsDraftingConclusion}
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={Constants.REQUEST_LIST_ROUTE}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isValid}
        />
      </FormContentContainer>
    </>
  )
}

export default OverviewForm
