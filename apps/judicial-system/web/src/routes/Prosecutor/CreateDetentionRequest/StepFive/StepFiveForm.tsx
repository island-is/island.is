import React from 'react'
import {
  Text,
  Box,
  AlertMessage,
  ContentBlock,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/useS3Upload'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import * as styles from './StepFive.treat'

interface Props {
  case: Case
}

export const StepFiveForm: React.FC<Props> = ({ case: workingCase }) => {
  const { files, onChange, onRemove } = useS3Upload(workingCase)
  return (
    <>
      <FormContentContainer>
        <Box marginBottom={10}>
          <Text as="h1" variant="h1">
            Rannsóknargögn
          </Text>
        </Box>
        <Box marginBottom={5}>
          <AlertMessage
            title="Meðferð gagna"
            message={
              <ul className={styles.ul}>
                <li>
                  <Box marginLeft={1}>
                    <Text>
                      Hér er hægt að hlaða upp rannsóknargögnum til að sýna
                      dómara.
                    </Text>
                  </Box>
                </li>
                <li>
                  <Box marginLeft={1}>
                    <Text>
                      Skjölin eru eingöngu aðgengileg settum dómara í málinu og
                      aðgengi að þeim lokast þegar dómari hefur úrskurðað.
                    </Text>
                  </Box>
                </li>
                <li>
                  <Box marginLeft={1}>
                    <Text>
                      Skjölin verða ekki lögð fyrir eða flutt í málakerfi
                      dómstóls nema annar hvor aðilinn kæri úrskurðinn.
                    </Text>
                  </Box>
                </li>
              </ul>
            }
            type="info"
          />
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
              errorMessage=""
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
