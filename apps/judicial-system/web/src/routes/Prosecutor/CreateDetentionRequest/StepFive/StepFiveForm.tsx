import React from 'react'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  BulletList,
  Bullet,
  Input,
  Tooltip,
} from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks/useS3Upload'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

export const StepFiveForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useS3Upload(workingCase)
  const { updateCase } = useCase()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Rannsóknargögn
          </Text>
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Meðferð gagna
            </Text>
          </Box>
          <BulletList type="ul">
            <Bullet>
              Hér er hægt að hlaða upp rannsóknargögnum til að sýna dómara.
            </Bullet>
            <Box marginTop={1}>
              <Bullet>
                Gögnin eru eingöngu aðgengileg dómara í málinu og aðgengi að
                þeim lokast þegar dómari hefur úrskurðað.
              </Bullet>
            </Box>
            <Box marginTop={1}>
              <Bullet>
                Gögnin verða ekki lögð fyrir eða flutt í málakerfi dómstóls nema
                annar hvor aðilinn kæri úrskurðinn.
              </Bullet>
            </Box>
          </BulletList>
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            Rannsóknargögn
          </Text>
        </Box>
        <Box marginBottom={10}>
          <ContentBlock>
            <InputFileUpload
              fileList={files}
              header="Dragðu skjöl hingað til að hlaða upp"
              buttonLabel="Velja skjöl til að hlaða upp"
              onChange={onChange}
              onRemove={onRemove}
              onRetry={onRetry}
              errorMessage={uploadErrorMessage}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              Athugasemdir vegna rannsóknargagna{' '}
              <Tooltip
                placement="right"
                as="span"
                text="Hér er hægt að skrá athugasemdir til dómara og dómritara varðandi rannsóknargögnin."
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label="Skilaboð"
              placeholder="Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi gögnin?"
              defaultValue={workingCase?.caseFilesComments}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(
                  workingCase.id,
                  parseString('caseFilesComments', evt.target.value),
                )
              }
              textarea
              rows={7}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.STEP_SIX_ROUTE}/${workingCase.id}`}
          nextIsDisabled={false}
        />
      </FormContentContainer>
    </>
  )
}
