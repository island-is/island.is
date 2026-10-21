import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  FileUploadStatus,
  InputFileUpload,
  Text,
} from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE } from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import type { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useAppealStatementDeadline from '@island.is/judicial-system-web/src/utils/hooks/useAppealStatementDeadline'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import { getVerdictAppealDefenderCaseNumber } from '../VerdictAppealDefender/VerdictAppealDefender.logic'
import {
  getStatementFileCategories,
  getStatementUploadHeaderLine,
  getStatementUploadParty,
  isPartyStatementFile,
} from './VerdictAppealStatementUpload.logic'

/**
 * Where the Court of Appeals files a party's statement on its behalf, when
 * the statement reached the court outside the system.
 *
 * The party comes from the query the deadlines page wrote, and the files go
 * in under that party, so the party's own advocate sees them in its case.
 * Nothing is written until the court submits: the files are staged here and
 * uploaded then, and the statement is recorded as filed once every one of
 * them is in. No mail goes out (owner's decision): the court is recording
 * what it has, not telling the party something it did itself.
 *
 * Not gated behind the feature flag, for the reason the deadlines page
 * gives: nothing links here but a verdict appeal's own steps.
 */
const VerdictAppealStatementUpload = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound, refreshCase } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { fileAppealStatement, isFilingAppealStatement } =
    useAppealStatementDeadline()

  // Read directly rather than through the shared resolver, as the deadlines
  // page does: this page is never about the case-level ruling appeal.
  const verdictAppealCase = workingCase.verdictAppealCase
  const party = getStatementUploadParty(workingCase, router.query)
  const categories = party ? getStatementFileCategories(party) : undefined

  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { onOpenFile } = useFileList({ caseId: workingCase.id })
  const { handleUpload } = useS3Upload(
    workingCase.id,
    party?.party.defendantId ?? undefined,
    party?.party.civilClaimantId ?? undefined,
  )

  const deadlinesUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE}/${workingCase.id}`,
    verdictAppealCase?.id,
  )

  const filesIn = (category: CaseFileCategory | undefined) =>
    party && category
      ? uploadFiles.filter((file) =>
          isPartyStatementFile(file, category, party),
        )
      : []
  const statementFiles = filesIn(categories?.statement)
  const caseFiles = filesIn(categories?.caseFile)

  // Staged as done so the box shows them as ready and the court can take
  // one out again before anything has been sent; the upload itself is what
  // the submit does, and it picks them out by their untouched progress.
  const stage = (files: File[], category: CaseFileCategory) =>
    addUploadFiles(files, {
      category,
      status: FileUploadStatus.done,
      defendantId: party?.party.defendantId ?? undefined,
      civilClaimantId: party?.party.civilClaimantId ?? undefined,
    })

  const submit = async () => {
    if (!party || !verdictAppealCase) {
      return
    }

    const result = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (result !== 'ALL_SUCCEEDED') {
      return
    }

    const filed = await fileAppealStatement({
      caseId: workingCase.id,
      appealCaseId: verdictAppealCase.id,
      defendantId: party.party.defendantId ?? undefined,
      civilClaimantId: party.party.civilClaimantId ?? undefined,
    })

    if (filed) {
      refreshCase()
      router.push(deadlinesUrl)
    }
  }

  const caseNumber = getVerdictAppealDefenderCaseNumber(workingCase)
  const uploadBox = {
    accept: 'application/pdf',
    title: formatMessage(core.uploadBoxTitle),
    description: formatMessage(core.uploadBoxDescription, {
      fileEndings: '.pdf',
    }),
    buttonLabel: formatMessage(core.uploadBoxButtonLabel),
    hideIcons: !allFilesDoneOrError,
    disabled: !allFilesDoneOrError,
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound || (!isLoadingWorkingCase && !party)}
    >
      <PageHeader title={titleForCase(formatMessage, workingCase)} />
      {party && categories && (
        <>
          <FormContentContainer>
            <Box marginBottom={5}>
              <PageTitle marginBottom={1}>Hlaða upp greinargerð</PageTitle>
              {caseNumber && (
                <Text as="h2" variant="h2">
                  {caseNumber}
                </Text>
              )}
              <Text as="p" variant="h5">
                {getStatementUploadHeaderLine(party)}
              </Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Greinargerð" required />
              <InputFileUpload
                {...uploadBox}
                name="appealStatement"
                files={statementFiles}
                onChange={(files) => stage(files, categories.statement)}
                onRemove={removeUploadFile}
                onOpenFile={onOpenFile}
              />
            </Box>
            <Box component="section" marginBottom={10}>
              <SectionHeading title="Gögn" marginBottom={1} />
              <Text marginBottom={3}>
                Ef ný gögn eiga að fylgja greinargerðinni er hægt að hlaða þeim
                upp hér að neðan.
              </Text>
              <InputFileUpload
                {...uploadBox}
                name="appealCaseFiles"
                files={caseFiles}
                onChange={(files) => stage(files, categories.caseFile)}
                onRemove={removeUploadFile}
                onOpenFile={onOpenFile}
              />
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={deadlinesUrl}
              actions={[
                {
                  text: someFilesError
                    ? 'Reyna aftur'
                    : 'Hlaða upp greinargerð',
                  colorScheme: someFilesError ? 'destructive' : 'default',
                  onClick: submit,
                  disabled:
                    statementFiles.length === 0 || isFilingAppealStatement,
                  loading: !allFilesDoneOrError || isFilingAppealStatement,
                  testId: 'continueButton',
                },
              ]}
            />
          </FormContentContainer>
        </>
      )}
    </PageLayout>
  )
}

export default VerdictAppealStatementUpload
