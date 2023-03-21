import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormContext,
  PageHeader,
  PageLayout,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Box,
  Button,
  InputFileUpload,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { core, titles } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import {
  TUploadFile,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { appealToCourtOfAppeals as strings } from './AppealToCourtOfAppeals.strings'

const AppealToCourtOfAppeals = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [displayFiles, setDisplayFiles] = useState<TUploadFile[]>([])
  const {
    handleChange,
    handleRemove,
    handleRetry,
    generateSingleFileUpdate,
  } = useS3Upload(workingCase.id)
  const { pid } = router.query

  const removeFileCB = useCallback((file: UploadFile) => {
    setDisplayFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )
  }, [])

  const handleUIUpdate = useCallback(
    (displayFile: TUploadFile, newId?: string) => {
      setDisplayFiles((previous) =>
        generateSingleFileUpdate(previous, displayFile, newId),
      )
    },
    [generateSingleFileUpdate],
  )

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <Box marginBottom={2}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() =>
              router.push(`${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${pid}`)
            }
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
        <Box marginBottom={1}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        {workingCase.courtEndTime && (
          <RulingDateLabel courtEndTime={workingCase.courtEndTime} />
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(strings.appealTitle)} />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.INDICTMENT,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(core.uploadBoxTitle)}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            multiple={false}
            onChange={(files) =>
              handleChange(
                files,
                CaseFileCategory.INDICTMENT,
                setDisplayFiles,
                handleUIUpdate,
              )
            }
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) => handleRetry(file, handleUIUpdate)}
          />
        </Box>
      </FormContentContainer>
    </PageLayout>
  )
}

export default AppealToCourtOfAppeals
