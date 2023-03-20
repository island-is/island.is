import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormContext,
  PageHeader,
  PageLayout,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { Box, Button, InputFileUpload, Text } from '@island.is/island-ui/core'
import { core, titles } from '@island.is/judicial-system-web/messages'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'

import { appealToCourtOfAppeals as strings } from './AppealToCourtOfAppeals.strings'
import { CaseFileCategory } from '@island.is/judicial-system/types'

const AppealToCourtOfAppeals = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { pid } = router.query

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
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            multiple={false}
            onChange={(files) =>
              handleChange(files, CaseFileCategory.INDICTMENT)
            }
            onRemove={handleRemove}
            onRetry={handleRetry}
          />
        </Box>
      </FormContentContainer>
    </PageLayout>
  )
}

export default AppealToCourtOfAppeals
