import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  Input,
} from '@island.is/island-ui/core'
import {
  formatDate,
  capitalize,
  formatCustodyRestrictions,
  laws,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { isNextDisabled } from '../../../utils/stepHelper'
import { FormFooter } from '../../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import { validate } from '../../../utils/validate'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseCustodyProvisions,
  UpdateCase,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import * as styles from './Overview.treat'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'

interface CaseData {
  case?: Case
}

export const JudgeOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [
    courtCaseNumberErrorMessage,
    setCourtCaseNumberErrorMessage,
  ] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const updateCase = useCallback(
    async (id: string, updateCase: UpdateCase) => {
      const { data } = await updateCaseMutation({
        variables: { input: { id, ...updateCase } },
      })
      const resCase = data?.updateCase
      if (resCase) {
        // Do something with the result. In particular, we want th modified timestamp passed between
        // the client and the backend so that we can handle multiple simultanious updates.
      }
      return resCase
    },
    [updateCaseMutation],
  )

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  return (
    <PageLayout
      activeSection={Sections.JUDGE}
      activeSubSection={JudgeSubsections.JUDGE_OVERVIEW}
      isLoading={loading}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Yfirlit kröfu
            </Text>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Málsnúmer héraðsdóms
              </Text>
            </Box>
            <Box marginBottom={1}>
              <Input
                data-testid="courtCaseNumber"
                name="courtCaseNumber"
                label="Slá inn málsnúmer"
                placeholder="R-X/ÁÁÁÁ"
                defaultValue={workingCase.courtCaseNumber}
                errorMessage={courtCaseNumberErrorMessage}
                hasError={courtCaseNumberErrorMessage !== ''}
                onBlur={(evt) => {
                  setWorkingCase({
                    ...workingCase,
                    courtCaseNumber: evt.target.value,
                  })

                  const validateField = validate(evt.target.value, 'empty')

                  if (validateField.isValid) {
                    updateCase(
                      workingCase.id,
                      parseString('courtCaseNumber', evt.target.value),
                    )
                  } else {
                    setCourtCaseNumberErrorMessage(validateField.errorMessage)
                  }
                }}
                onFocus={() => setCourtCaseNumberErrorMessage('')}
                required
              />
            </Box>
            <Box>
              <Text
                variant="small"
                fontWeight="semiBold"
              >{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
            </Box>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Kennitala
              </Text>
            </Box>
            <Text variant="h3">
              {formatNationalId(workingCase.accusedNationalId)}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Fullt nafn
              </Text>
            </Box>
            <Text variant="h3">{workingCase.accusedName}</Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Lögheimili/dvalarstaður
              </Text>
            </Box>
            <Text variant="h3">{workingCase.accusedAddress}</Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Dómstóll
              </Text>
            </Box>
            <Text variant="h3">{workingCase.court}</Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Tími handtöku
              </Text>
            </Box>
            <Text variant="h3">
              {workingCase.arrestDate &&
                `${capitalize(
                  formatDate(workingCase.arrestDate, 'PPPP') || '',
                )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Ósk um fyrirtökudag og tíma
              </Text>
            </Box>
            <Text variant="h3">
              {`${capitalize(
                formatDate(workingCase.requestedCourtDate, 'PPPP') || '',
              )} eftir kl. ${formatDate(
                workingCase.requestedCourtDate,
                TIME_FORMAT,
              )}`}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" color="blue400">
                Ákærandi
              </Text>
            </Box>
            <Text variant="h3">
              {workingCase.prosecutor?.name} {workingCase.prosecutor?.title}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Accordion singleExpand={false}>
              <AccordionItem
                id="id_1"
                label="Dómkröfur"
                startExpanded
                labelVariant="h3"
              >
                <Text>
                  Þess er krafist að
                  <Text as="span" fontWeight="semiBold">
                    {` ${workingCase?.accusedName}
                    ${formatNationalId(workingCase.accusedNationalId)}`}
                  </Text>
                  , verði með úrskurði Héraðsdóms Reykjavíkur gert að sæta
                  gæsluvarðhaldi til
                  <Text as="span" fontWeight="semiBold">
                    {` ${formatDate(
                      workingCase.requestedCustodyEndDate,
                      'EEEE',
                    ).replace('dagur', 'dagsins')}
                    ${formatDate(
                      workingCase.requestedCustodyEndDate,
                      'PPP',
                    )},  kl. ${formatDate(
                      workingCase?.requestedCustodyEndDate,
                      TIME_FORMAT,
                    )}`}
                  </Text>
                  {workingCase.requestedCustodyRestrictions?.includes(
                    CaseCustodyRestrictions.ISOLATION,
                  ) ? (
                    <>
                      , og verði gert að{' '}
                      <Text as="span" fontWeight="semiBold">
                        sæta einangrun
                      </Text>{' '}
                      á meðan gæsluvarðhaldinu stendur.
                    </>
                  ) : (
                    '.'
                  )}
                </Text>
              </AccordionItem>
              <AccordionItem
                id="id_2"
                label="Lagaákvæði"
                startExpanded
                labelVariant="h3"
              >
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      Lagaákvæði sem brot varða við
                    </Text>
                  </Box>
                  <Text>
                    <span className={styles.breakSpaces}>
                      {workingCase.lawsBroken}
                    </span>
                  </Text>
                </Box>
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text as="h4" variant="h4">
                      Lagaákvæði sem krafan er byggð á
                    </Text>
                  </Box>
                  {workingCase.custodyProvisions?.map(
                    (custodyProvision: CaseCustodyProvisions, index) => {
                      return (
                        <div key={index}>
                          <Text>{laws[custodyProvision]}</Text>
                        </div>
                      )
                    },
                  )}
                </Box>
              </AccordionItem>
              <AccordionItem
                id="id_3"
                label="Takmarkanir á gæslu"
                startExpanded
                labelVariant="h3"
              >
                <Text>
                  {formatCustodyRestrictions(
                    workingCase.requestedCustodyRestrictions,
                  )}
                </Text>
              </AccordionItem>
              <AccordionItem
                id="id_4"
                label="Greinagerð um málsatvik og lagarök"
                startExpanded
                labelVariant="h3"
              >
                {workingCase.caseFacts && (
                  <Box marginBottom={2}>
                    <Box marginBottom={2}>
                      <Text variant="h5">Málsatvik rakin</Text>
                    </Box>
                    <Text>
                      <span className={styles.breakSpaces}>
                        {workingCase.caseFacts}
                      </span>
                    </Text>
                  </Box>
                )}
                {workingCase.legalArguments && (
                  <Box marginBottom={2}>
                    <Box marginBottom={2}>
                      <Text variant="h5">Lagarök</Text>
                    </Box>
                    <Text>
                      <span className={styles.breakSpaces}>
                        {workingCase.legalArguments}
                      </span>
                    </Text>
                  </Box>
                )}
              </AccordionItem>
              <AccordionItem
                id="id_5"
                label="Skilaboð til dómara"
                startExpanded
                labelVariant="h3"
              >
                <Text>
                  <span className={styles.breakSpaces}>
                    {workingCase.comments}
                  </span>
                </Text>
              </AccordionItem>
            </Accordion>
          </Box>
          <FormFooter
            nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
            nextIsDisabled={isNextDisabled([
              {
                value: workingCase.courtCaseNumber || '',
                validations: ['empty'],
              },
            ])}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default JudgeOverview
