import React, { FC, useState } from 'react'
import {
  Application,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'
import Timeline from '../components/Timeline'
import {
  formatPeriods,
  getExpectedDateOfBirth,
  getNameAndIdOfSpouse,
} from '../parentalLeaveUtils'
import { Period } from '../../types'
import PaymentsTable from '../PaymentSchedule/PaymentsTable'
import YourRightsBoxChart from '../Rights/YourRightsBoxChart'
import { useQuery } from '@apollo/client'
import { getEstimatedPayments } from '../PaymentSchedule/estimatedPaymentsQuery'
import { m, mm } from '../../lib/messages'
import { YES, NO } from '../../constants'
import useOtherParentOptions from '../../hooks/useOtherParentOptions'

type ValidOtherParentAnswer = 'no' | 'manual' | undefined
type ValidRadioAnswer = 'yes' | 'no' | undefined

const ReadOnlyReview: FC<{ application: Application }> = ({ application }) => {
  const dob = getExpectedDateOfBirth(application)
  if (!dob) {
    return null
  }
  const dobDate = new Date(dob)

  const [allItemsExpanded, toggleAllItemsExpanded] = useState(true)
  const { formatMessage } = useLocale()
  const {
    options: otherParentOptions,
    loading: loadingSpouseName,
  } = useOtherParentOptions()

  const statefulOtherParentConfirmed = getValueViaPath(
    application.answers,
    'otherParent',
  ) as ValidOtherParentAnswer

  const statefulPrivatePension = getValueViaPath(
    application.answers,
    'usePrivatePensionFund',
  ) as ValidRadioAnswer

  const { data, error, loading } = useQuery(getEstimatedPayments, {
    variables: {
      input: {
        dateOfBirth: dob,
        period: [
          {
            from: '2021-01-01',
            to: '2021-01-01',
            ratio: 100,
            approved: true,
            paid: true,
          },
        ],
      },
    },
  })

  // TODO: This will also come from somewhere in the external data
  const otherParentPeriods: Period[] = [
    {
      startDate: dob,
      endDate: '2021-05-17T00:00:00.000Z',
      ratio: 50,
    },
    {
      startDate: '2021-03-13T00:00:00.000Z',
      endDate: '2021-10-03T00:00:00.000Z',
      ratio: 50,
    },
  ]

  return (
    <div>
      <Box marginTop={[2, 2, 4]} marginBottom={[0, 0, 6]}>
        <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
          <Button
            colorScheme="default"
            iconType="filled"
            icon={allItemsExpanded ? 'remove' : 'add'}
            onClick={() => {
              toggleAllItemsExpanded(!allItemsExpanded)
            }}
            preTextIconType="filled"
            size="default"
            type="button"
            variant="utility"
          >
            {allItemsExpanded
              ? `${formatMessage(mm.confirmation.collapseAll)}`
              : `${formatMessage(mm.confirmation.epxandAll)}`}
          </Button>
        </Box>

        <Accordion singleExpand={false}>
          <AccordionItem
            id="id_1"
            label={formatMessage(m.otherParentTitle)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              {statefulOtherParentConfirmed === 'manual' && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      <Text>
                        {
                          getValueViaPath(
                            application.answers,
                            'otherParentName',
                          ) as string[]
                        }
                      </Text>
                    </GridColumn>
                    <GridColumn span="6/12">
                      <Text>
                        {
                          getValueViaPath(
                            application.answers,
                            'otherParentId',
                          ) as string[]
                        }
                      </Text>
                    </GridColumn>
                  </GridRow>
                </>
              )}
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_3"
            label={formatMessage(m.paymentInformationSubSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'payments.bank',
                      ) as string[]
                    }
                  </Text>
                </GridColumn>
                <GridColumn span="6/12">
                  {
                    //TODO add the personal allowance questions when finished
                  }
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'payments.pensionFund',
                      ) as string[]
                    }
                  </Text>
                </GridColumn>
                <GridColumn span="6/12">
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'payments.union',
                      ) as string[]
                    }
                  </Text>
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="12/12">
                  <Box marginTop={1} marginBottom={2}>
                    <Text variant="h5">
                      {formatMessage(m.privatePensionFundName)}
                    </Text>
                  </Box>
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'usePrivatePensionFund',
                      ) as string[]
                    }
                  </Text>
                </GridColumn>
              </GridRow>

              {statefulPrivatePension === YES && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      <Text>
                        {
                          getValueViaPath(
                            application.answers,
                            'payments.pensionFund',
                          ) as string[]
                        }
                      </Text>
                    </GridColumn>
                    <GridColumn span="6/12">
                      <Text>
                        {
                          getValueViaPath(
                            application.answers,
                            'payments.union',
                          ) as string[]
                        }
                      </Text>
                    </GridColumn>
                  </GridRow>
                </>
              )}
            </Box>
          </AccordionItem>
          <AccordionItem
            id="id_1"
            label={formatMessage(mm.employer.subSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'employer.email',
                      ) as string[]
                    }
                  </Text>
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(m.yourRights)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <YourRightsBoxChart application={application} />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(m.periodsSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Timeline
                    initDate={dobDate}
                    title={formatMessage(m.expectedDateOfBirthTitle)}
                    titleSmall={formatMessage(m.dateOfBirthTitle)}
                    periods={formatPeriods(
                      application.answers.periods as Period[],
                      otherParentPeriods,
                    )}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(mm.paymentPlan.subSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  {!loading && !error && (
                    <PaymentsTable
                      application={application}
                      payments={data.getEstimatedPayments}
                    />
                  )}
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(mm.shareInformation.subSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Box marginTop={1} marginBottom={2}>
                    <Text variant="h5">
                      {formatMessage(mm.shareInformation.title)}
                    </Text>
                  </Box>
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'shareInformationWithOtherParent',
                      ) as string[]
                    }
                  </Text>
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  )
}

export default ReadOnlyReview
