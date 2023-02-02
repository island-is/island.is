import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'
import { uuid } from 'uuidv4'

import {
  ProsecutorCaseInfo,
  FormContentContainer,
  FormFooter,
  PageLayout,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { errors, titles } from '@island.is/judicial-system-web/messages'
import {
  Box,
  InputFileUpload,
  Text,
  toast,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  TUploadFile,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseFileCategory,
  Feature,
  IndictmentSubtype,
} from '@island.is/judicial-system/types'
import { mapCaseFileToUploadFile } from '@island.is/judicial-system-web/src/utils/formHelper'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import { hasIndictmentSubtype } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import * as constants from '@island.is/judicial-system/consts'

import * as strings from './CaseFiles.strings'

const CaseFiles: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const [displayFiles, setDisplayFiles] = useState<TUploadFile[]>([])
  const { formatMessage } = useIntl()
  const { upload, remove } = useS3Upload(workingCase.id)
  const { features } = useContext(FeatureContext)
  const isTrafficViolationCase =
    features.includes(Feature.INDICTMENT_ROUTE) &&
    hasIndictmentSubtype(
      workingCase.indictmentSubtypes,
      IndictmentSubtype.TRAFFIC_VIOLATION,
    )

  useEffect(() => {
    if (workingCase.caseFiles) {
      setDisplayFiles(workingCase.caseFiles.map(mapCaseFileToUploadFile))
    }
  }, [workingCase.caseFiles])

  const allFilesUploaded = useMemo(() => {
    return displayFiles.every(
      (file) => file.status === 'done' || file.status === 'error',
    )
  }, [displayFiles])

  const stepIsValid = allFilesUploaded
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const setSingleFile = useCallback(
    (displayFile: TUploadFile, newId?: string) => {
      setDisplayFiles((previous) => {
        const index = previous.findIndex((f) => f.id === displayFile.id)
        if (index === -1) {
          return previous
        }
        const next = [...previous]
        next[index] = { ...displayFile, id: newId ?? displayFile.id }
        return next
      })
    },
    [setDisplayFiles],
  )

  const handleChange = useCallback(
    (files: File[], category: CaseFileCategory) => {
      // We generate an id for each file so that we find the file again when
      // updating the file's progress and onRetry.
      // Also we cannot spread File since it contains read-only properties.
      const filesWithId: Array<[File, string]> = files.map((file) => [
        file,
        `${file.name}-${uuid()}`,
      ])
      setDisplayFiles((previous) => [
        ...filesWithId.map(
          ([file, id]): TUploadFile => ({
            status: 'uploading',
            percent: 1,
            name: file.name,
            id: id,
            type: file.type,
            category,
          }),
        ),
        ...previous,
      ])
      upload(filesWithId, setSingleFile, category)
    },
    [upload, setSingleFile],
  )

  const handleRemove = useCallback(
    async (file: UploadFile) => {
      try {
        if (file.id) {
          await remove(file.id)
          setDisplayFiles((prev) => {
            return prev.filter((caseFile) => caseFile.id !== file.id)
          })
        }
      } catch {
        toast.error(formatMessage(errors.general))
      }
    },
    [formatMessage, remove, setDisplayFiles],
  )

  const handleRetry = useCallback(
    (file: TUploadFile) => {
      setSingleFile({
        name: file.name,
        id: file.id,
        percent: 1,
        status: 'uploading',
        type: file.type,
        category: file.category,
      })
      upload(
        [
          [
            { name: file.name, type: file.type ?? '' } as File,
            file.id ?? file.name,
          ],
        ],
        setSingleFile,
        file.category,
      )
    },
    [setSingleFile, upload],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={
        IndictmentsProsecutorSubsections.CASE_FILES +
        (isTrafficViolationCase ? 1 : 0)
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.caseFiles)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.caseFiles.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.coverLetter)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.COVER_LETTER,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
            onChange={(files) =>
              handleChange(files, CaseFileCategory.COVER_LETTER)
            }
            onRemove={handleRemove}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.indictment)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.INDICTMENT,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
            onChange={(files) =>
              handleChange(files, CaseFileCategory.INDICTMENT)
            }
            onRemove={handleRemove}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.criminalRecord)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleChange(files, CaseFileCategory.CRIMINAL_RECORD)
            }
            onRemove={handleRemove}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.costBreakdown)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleChange(files, CaseFileCategory.COST_BREAKDOWN)
            }
            onRemove={handleRemove}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.otherDocuments)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) =>
                file.category === CaseFileCategory.CASE_FILE &&
                !file.policeCaseNumber,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleChange(files, CaseFileCategory.CASE_FILE)
            }
            onRemove={handleRemove}
            onRetry={handleRetry}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${
            isTrafficViolationCase
              ? constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE
              : constants.INDICTMENTS_PROCESSING_ROUTE
          }/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
