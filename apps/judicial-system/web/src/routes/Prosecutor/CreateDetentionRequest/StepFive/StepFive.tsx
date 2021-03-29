import React, { useEffect, useState } from 'react'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  AlertMessage,
} from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import * as styles from './StepFive.treat'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/useS3Upload'

export const StepFive: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const router = useRouter()
  const id = router.query.id

  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Rannsóknargögn - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && resCase) {
      setWorkingCase(resCase)
    }
  }, [id, workingCase, setWorkingCase, resCase])

  const { files, onChange, onRemove } = useS3Upload(workingCase)

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_FIVE
      }
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
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
                          Skjölin eru eingöngu aðgengileg settum dómara í málinu
                          og aðgengi að þeim lokast þegar dómari hefur
                          úrskurðað.
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
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepFive
