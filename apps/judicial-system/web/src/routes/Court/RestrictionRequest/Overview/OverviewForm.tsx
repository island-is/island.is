import React from 'react'
import {
  Case,
  CaseType,
  IntegratedCourts,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import * as styles from './Overview.treat'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  handleCreateCourtCase: (wc: Case) => void
  createCourtCaseSuccess: boolean
  setCreateCourtCaseSuccess: React.Dispatch<React.SetStateAction<boolean>>
  courtCaseNumberEM: string
  setCourtCaseNumberEM: React.Dispatch<React.SetStateAction<string>>
}

const OverviewForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    handleCreateCourtCase,
    createCourtCaseSuccess,
    setCreateCourtCaseSuccess,
    courtCaseNumberEM,
    setCourtCaseNumberEM,
  } = props
  const { updateCase, isCreatingCourtCase } = useCase()

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          {`Yfirlit ${
            workingCase.type === CaseType.CUSTODY
              ? 'gæsluvarðhaldskröfu'
              : 'farbannskröfu'
          }`}
        </Text>
      </Box>
      <Box component="section" marginBottom={6}>
        <Box marginBottom={2}>
          <Text as="h2" variant="h3">
            Málsnúmer héraðsdóms
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>
            Smelltu á hnappinn til að stofna nýtt mál eða skráðu inn málsnúmer
            sem er þegar til í Auði. Athugið að gögn verða sjálfkrafa vistuð á
            það málsnúmer sem slegið er inn.
          </Text>
        </Box>
        <BlueBox>
          <div className={styles.createCourtCaseContainer}>
            <Box display="flex">
              {workingCase.court &&
                IntegratedCourts.includes(workingCase.court.id) && (
                  <div className={styles.createCourtCaseButton}>
                    <Button
                      size="small"
                      onClick={() => handleCreateCourtCase(workingCase)}
                      loading={isCreatingCourtCase}
                      disabled={Boolean(workingCase.courtCaseNumber)}
                      fluid
                    >
                      Stofna nýtt mál
                    </Button>
                  </div>
                )}
              <div className={styles.createCourtCaseInput}>
                <Input
                  data-testid="courtCaseNumber"
                  name="courtCaseNumber"
                  label="Mál nr."
                  placeholder="R-X/ÁÁÁÁ"
                  size="sm"
                  backgroundColor="white"
                  value={workingCase.courtCaseNumber ?? ''}
                  icon={
                    workingCase.courtCaseNumber && createCourtCaseSuccess
                      ? 'checkmark'
                      : undefined
                  }
                  errorMessage={courtCaseNumberEM}
                  hasError={!isCreatingCourtCase && courtCaseNumberEM !== ''}
                  onChange={(event) => {
                    setCreateCourtCaseSuccess(false)
                    removeTabsValidateAndSet(
                      'courtCaseNumber',
                      event,
                      ['empty'],
                      workingCase,
                      setWorkingCase,
                      courtCaseNumberEM,
                      setCourtCaseNumberEM,
                    )
                  }}
                  onBlur={(event) => {
                    validateAndSendToServer(
                      'courtCaseNumber',
                      event.target.value,
                      ['empty'],
                      workingCase,
                      updateCase,
                      setCourtCaseNumberEM,
                    )
                  }}
                  required
                />
              </div>
            </Box>
          </div>
        </BlueBox>
      </Box>
    </FormContentContainer>
  )
}

export default OverviewForm
