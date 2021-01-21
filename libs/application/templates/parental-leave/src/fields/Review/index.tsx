import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Application, getValueViaPath } from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import {
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import Timeline from '../components/Timeline'
import { formatPeriods, getExpectedDateOfBirth } from '../parentalLeaveUtils'
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

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
  editable?: boolean
}

const Review: FC<ReviewScreenProps> = ({
  application,
  goToScreen,
  editable = true,
}) => {
  const [allItemsExpanded, toggleAllItemsExpanded] = useState(true)

  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const {
    options: otherParentOptions,
    loading: loadingSpouseName,
  } = useOtherParentOptions()

  const [
    statefulOtherParentConfirmed,
    setStatefulOtherParentConfirmed,
  ] = useState<ValidOtherParentAnswer>(
    getValueViaPath(
      application.answers,
      'otherParent',
    ) as ValidOtherParentAnswer,
  )

  const [statefulPrivatePension, setStatefulPrivatePension] = useState<
    ValidRadioAnswer
  >(
    getValueViaPath(
      application.answers,
      'usePrivatePensionFund',
    ) as ValidRadioAnswer,
  )

  const dob = getExpectedDateOfBirth(application)
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
  if (!dob) {
    return null
  }
  const dobDate = new Date(dob)

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
            id="id_4"
            label={formatMessage(m.otherParentTitle)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <Box>
                {editable ? (
                  loadingSpouseName ? (
                    <SkeletonLoader repeat={3} space={1} height={48} />
                  ) : (
                    <RadioController
                      id="otherParent"
                      disabled={false}
                      name="otherParent"
                      defaultValue={
                        getValueViaPath(
                          application.answers,
                          'otherParent',
                        ) as string[]
                      }
                      options={otherParentOptions}
                      onSelect={(s: string) => {
                        setStatefulOtherParentConfirmed(
                          s as ValidOtherParentAnswer,
                        )
                      }}
                    />
                  )
                ) : (
                  <Text>
                    {
                      getValueViaPath(
                        application.answers,
                        'otherParent',
                      ) as string[]
                    }
                  </Text>
                )}
              </Box>
              {statefulOtherParentConfirmed === 'manual' && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      {editable ? (
                        <Input
                          id="otherParentName"
                          name="otherParentName"
                          label={formatMessage(m.otherParentName)}
                          ref={register}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'otherParentName',
                            ) as string[]
                          }
                        </Text>
                      )}
                    </GridColumn>
                    <GridColumn span="6/12">
                      {editable ? (
                        <Input
                          id="otherParentId"
                          name="otherParentId"
                          label={formatMessage(m.otherParentID)}
                          ref={register}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'otherParentId',
                            ) as string[]
                          }
                        </Text>
                      )}
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
                  {editable ? (
                    <Input
                      id="payments.bank"
                      name="payments.bank"
                      label={formatMessage(m.paymentInformationBank)}
                      ref={register}
                    />
                  ) : (
                    <Text>
                      {
                        getValueViaPath(
                          application.answers,
                          'payments.bank',
                        ) as string[]
                      }
                    </Text>
                  )}
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
                  {editable ? (
                    <SelectController
                      label={formatMessage(m.salaryLabelPensionFund)}
                      name="payments.pensionFund"
                      disabled={false}
                      id="payments.pensionFund"
                      options={[{ label: 'TODO', value: 'todo' }]}
                    />
                  ) : (
                    <Text>
                      {
                        getValueViaPath(
                          application.answers,
                          'payments.pensionFund',
                        ) as string[]
                      }
                    </Text>
                  )}
                </GridColumn>
                <GridColumn span="6/12">
                  {editable ? (
                    <SelectController
                      label={formatMessage(m.union)}
                      name="payments.union"
                      disabled={false}
                      id="payments.union"
                      options={[{ label: 'TODO', value: 'todo' }]}
                    />
                  ) : (
                    <Text>
                      {
                        getValueViaPath(
                          application.answers,
                          'payments.union',
                        ) as string[]
                      }
                    </Text>
                  )}
                </GridColumn>
              </GridRow>

              <Box marginTop={3} />

              <Text variant="h5" marginTop={1} marginBottom={2}>
                {formatMessage(m.privatePensionFundName)}
              </Text>

              {editable ? (
                <RadioController
                  id="usePrivatePensionFund"
                  disabled={false}
                  name="usePrivatePensionFund"
                  defaultValue={
                    getValueViaPath(
                      application.answers,
                      'usePrivatePensionFund',
                    ) as string[]
                  }
                  options={[
                    { label: formatMessage(m.yesOptionLabel), value: YES },
                    { label: formatMessage(m.noOptionLabel), value: NO },
                  ]}
                  onSelect={(s: string) => {
                    setStatefulPrivatePension(s as ValidRadioAnswer)
                  }}
                />
              ) : (
                <Text>
                  {
                    getValueViaPath(
                      application.answers,
                      'usePrivatePensionFund',
                    ) as string[]
                  }
                </Text>
              )}

              {statefulPrivatePension === YES && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      {editable ? (
                        <SelectController
                          label={formatMessage(m.privatePensionFund)}
                          name="payments.pensionFund"
                          disabled={false}
                          id="payments.pensionFund"
                          options={[{ label: 'TODO', value: 'todo' }]}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'payments.pensionFund',
                            ) as string[]
                          }
                        </Text>
                      )}
                    </GridColumn>
                    <GridColumn span="6/12">
                      {editable ? (
                        <SelectController
                          label={formatMessage(m.union)}
                          name={'payments.union'}
                          disabled={false}
                          id={'payments.union'}
                          options={[{ label: 'TODO', value: 'todo' }]}
                        />
                      ) : (
                        <Text>
                          {
                            getValueViaPath(
                              application.answers,
                              'payments.union',
                            ) as string[]
                          }
                        </Text>
                      )}
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
            {editable ? (
              <Box paddingY={4}>
                <Input
                  id={'employer.email'}
                  name={'employer.email'}
                  label={formatMessage(mm.employer.email)}
                  ref={register}
                />
              </Box>
            ) : (
              <Text paddingY={4}>
                {
                  getValueViaPath(
                    application.answers,
                    'employer.email',
                  ) as string[]
                }
              </Text>
            )}
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(m.yourRights)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <YourRightsBoxChart application={application} />
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(m.periodsSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <Timeline
                initDate={dobDate}
                title={formatMessage(m.expectedDateOfBirthTitle)}
                titleSmall={formatMessage(m.dateOfBirthTitle)}
                periods={formatPeriods(
                  application.answers.periods as Period[],
                  otherParentPeriods,
                )}
              />
              {editable && (
                <Box paddingTop={3}>
                  <Button
                    size="small"
                    onClick={() => goToScreen && goToScreen('periods')}
                  >
                    {formatMessage(mm.leavePlan.change)}
                  </Button>
                </Box>
              )}
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(mm.paymentPlan.subSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              {!loading && !error && (
                <PaymentsTable
                  application={application}
                  payments={data.getEstimatedPayments}
                />
              )}
            </Box>
          </AccordionItem>

          <AccordionItem
            id="id_4"
            label={formatMessage(mm.shareInformation.subSection)}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <Box marginTop={1} marginBottom={2} marginLeft={4}>
                <Text variant="h5">
                  {formatMessage(mm.shareInformation.title)}
                </Text>
              </Box>

              {editable ? (
                <RadioController
                  id={'shareInformationWithOtherParent'}
                  disabled={false}
                  name={'shareInformationWithOtherParent'}
                  defaultValue={
                    getValueViaPath(
                      application.answers,
                      'shareInformationWithOtherParent',
                    ) as string[]
                  }
                  options={[
                    { label: formatMessage(m.yesOptionLabel), value: YES },
                    { label: formatMessage(m.noOptionLabel), value: NO },
                  ]}
                />
              ) : (
                <Text>
                  {
                    getValueViaPath(
                      application.answers,
                      'shareInformationWithOtherParent',
                    ) as string[]
                  }
                </Text>
              )}
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  )
}

export default Review
