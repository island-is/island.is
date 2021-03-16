import React, { useEffect, useState } from 'react'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { Case, UpdateCase } from '@island.is/judicial-system/types'
import {
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'

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

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

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
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Rannsóknargögn
            </Text>
          </Box>
          <Box marginBottom={[2, 2, 3]}>
            <ContentBlock>
              <InputFileUpload
                fileList={[]}
                header="Dragðu skjöl hingað til að hlaða upp"
                description="Tekið er við skjölum með endingu: .pdf, .docx, .rtf"
                buttonLabel="Velja skjöl til að hlaða upp"
                onChange={(evt) => console.log(evt)}
                onRemove={() => console.log('remove')}
                errorMessage={''}
              />
            </ContentBlock>
          </Box>
          <FormFooter
            previousUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
            nextUrl={`${Constants.STEP_SIX_ROUTE}/${workingCase.id}`}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepFive
