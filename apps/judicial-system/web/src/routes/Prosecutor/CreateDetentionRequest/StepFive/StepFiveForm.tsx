import React from 'react'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  BulletList,
  Bullet,
} from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks/useS3Upload'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'

interface Props {
  case: Case
}

export const StepFiveForm: React.FC<Props> = ({ case: workingCase }) => {
  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useS3Upload(workingCase)

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
        <Box marginBottom={[2, 2, 3]}>
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
