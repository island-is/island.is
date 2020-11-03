import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'

import {
  FieldDescription,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import BoxChart from '../components/BoxChart'
import Timeline from '../components/Timeline'
import {
  formatIsk,
  formatPeriods,
  getExpectedDateOfBirth,
  getNameAndIdOfSpouse,
} from '../parentalLeaveUtils'
import { Payment, Period } from '../../types'
import { default as format } from 'date-fns/format'
import Table from '../components/Table'
import { m } from '../../lib/messages'

type ValidOtherParentAnswer = 'no' | 'manual' | undefined
type ValidRadioAnswer = 'yes' | 'no' | undefined

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const [
    statefulOtherParentConfirmed,
    setStatefulOtherParentConfirmed,
  ] = useState<ValidOtherParentAnswer>(
    getValueViaPath(
      application.answers,
      'otherParent',
    ) as ValidOtherParentAnswer,
  )
  const [spouseName, spouseId] = getNameAndIdOfSpouse(application)
  const otherParentInfoAvailable =
    spouseName !== undefined && spouseId !== undefined

  const otherParentOptions = [
    {
      value: 'no',
      label: 'I do not want to confirm the other parent at this time ',
    },
    { value: 'manual', label: 'The other parent is:' },
  ]

  if (otherParentInfoAvailable) {
    otherParentOptions.unshift({
      value: 'spouse',
      label: `The other parent is ${spouseName} (kt. ${spouseId})`,
    })
  }

  const [statefulPrivatePension, setStatefulPrivatePension] = useState<
    ValidRadioAnswer
  >(
    getValueViaPath(
      application.answers,
      'usePrivatePensionFund',
    ) as ValidRadioAnswer,
  )

  const dob = getExpectedDateOfBirth(application)
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

  // TODO: This will come from the formValue
  const payments: Payment[] = [
    {
      date: '2020-12-01T00:00:00.000Z',
      pensionContribution: 12400,
      tax: 67000,
      amount: 389000,
    },
    {
      date: '2021-01-01T00:00:00.000Z',
      pensionContribution: 14800,
      tax: 77500,
      amount: 405300,
    },
    {
      date: '2021-02-01T00:00:00.000Z',
      pensionContribution: 14800,
      tax: 77500,
      amount: 405300,
    },
    {
      date: '2021-03-01T00:00:00.000Z',
      pensionContribution: 14800,
      tax: 77500,
      amount: 405300,
    },
    {
      date: '2021-04-01T00:00:00.000Z',
      pensionContribution: 11230,
      tax: 35000,
      amount: 119000,
    },
    {
      date: '2021-05-01T00:00:00.000Z',
      pensionContribution: 11230,
      tax: 35000,
      amount: 119000,
    },
    {
      date: '2021-06-01T00:00:00.000Z',
      pensionContribution: 11230,
      tax: 35000,
      amount: 119000,
    },
    {
      date: '2021-07-01T00:00:00.000Z',
      pensionContribution: 11230,
      tax: 35000,
      amount: 119000,
    },
    {
      date: '2021-08-01T00:00:00.000Z',
      pensionContribution: 11230,
      tax: 35000,
      amount: 119000,
    },
  ]

  // TODO: Copy pasted code from PaymentSchedule/index... will refactor
  const formatedPayments = payments.map((payment) => {
    const paymentDate = new Date(payment.date)
    return {
      year: format(paymentDate, 'yyyy'),
      month: format(paymentDate, 'MMMM'),
      tax: formatIsk(payment.tax),
      pensionContribution: formatIsk(payment.pensionContribution),
      amount: formatIsk(payment.amount),
    }
  })

  const data = React.useMemo(() => [...formatedPayments], [formatedPayments])
  const columns = React.useMemo(
    () => [
      {
        Header: formatText(m.salaryLabelYear, application, formatMessage),
        accessor: 'year', // accessor is the "key" in the data
      } as const,
      {
        Header: formatText(m.salaryLabelMonth, application, formatMessage),
        accessor: 'month',
      } as const,
      {
        Header: formatText(
          m.salaryLabelPensionFund,
          application,
          formatMessage,
        ),
        accessor: 'pensionContribution',
      } as const,
      {
        Header: formatText(m.salaryLabelTax, application, formatMessage),
        accessor: 'tax',
      } as const,
      {
        Header: formatText(m.salaryLabelPaidAmount, application, formatMessage),
        accessor: 'amount',
      } as const,
    ],
    [application, formatMessage],
  )

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginTop={8} marginBottom={6}>
        <Accordion singleExpand={false}>
          <AccordionItem id="id_1" label="Contact information">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.email'}
                    name={'applicant.email'}
                    label={'Email'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.phoneNumber'}
                    name={'applicant.phoneNumber'}
                    label={'Phone number'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>

          <AccordionItem id="id_4" label="Other parent confirmation">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <RadioController
                    emphasize={true}
                    id={'otherParent'}
                    disabled={false}
                    name={'otherParent'}
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
                </GridColumn>
              </GridRow>
              {statefulOtherParentConfirmed === 'manual' && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      <Input
                        id={'otherParentName'}
                        name={'otherParentName'}
                        label={'Name of other parent'}
                        ref={register}
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <Input
                        id={'otherParentId'}
                        name={'otherParentId'}
                        label={'National ID of other parent'}
                        ref={register}
                      />
                    </GridColumn>
                  </GridRow>
                </>
              )}
            </Box>
          </AccordionItem>

          <AccordionItem id="id_3" label="Payment details">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'payments.bank'}
                    name={'payments.bank'}
                    label={'Bank'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <SelectController
                    label={'Personal discount'}
                    name={'payments.personalAllowanceUsage'}
                    disabled={false}
                    id={'payments.personalAllowanceUsage'}
                    options={[
                      { label: '100%', value: '100' },
                      { label: '75%', value: '75' },
                      { label: '50%', value: '50' },
                      { label: '25%', value: '25' },
                    ]}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <SelectController
                    label={'Pension fund (optional)'}
                    name={'payments.pensionFund'}
                    disabled={false}
                    id={'payments.pensionFund'}
                    options={[{ label: 'TODO', value: 'todo' }]}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <SelectController
                    label={'Union (optional)'}
                    name={'payments.union'}
                    disabled={false}
                    id={'payments.union'}
                    options={[{ label: 'TODO', value: 'todo' }]}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="12/12">
                  <Box marginTop={1} marginBottom={2} marginLeft={4}>
                    <Text variant="h5">
                      Do you wish to pay to a private pension fund?
                    </Text>
                  </Box>

                  <RadioController
                    emphasize={true}
                    id={'usePrivatePensionFund'}
                    disabled={false}
                    name={'usePrivatePensionFund'}
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'usePrivatePensionFund',
                      ) as string[]
                    }
                    options={[
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                    onSelect={(s: string) => {
                      setStatefulPrivatePension(s as ValidRadioAnswer)
                    }}
                  />
                </GridColumn>
              </GridRow>

              {statefulPrivatePension === 'yes' && (
                <>
                  <Box marginTop={3} />
                  <GridRow>
                    <GridColumn span="6/12">
                      <SelectController
                        label={'Pension fund (optional)'}
                        name={'payments.pensionFund'}
                        disabled={false}
                        id={'payments.pensionFund'}
                        options={[{ label: 'TODO', value: 'todo' }]}
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <SelectController
                        label={'Union (optional)'}
                        name={'payments.union'}
                        disabled={false}
                        id={'payments.union'}
                        options={[{ label: 'TODO', value: 'todo' }]}
                      />
                    </GridColumn>
                  </GridRow>
                </>
              )}
            </Box>
          </AccordionItem>
          <AccordionItem id="id_1" label="Employer">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'employer.name'}
                    name={'employer.name'}
                    label={'Name'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'employer.nationalRegistryId'}
                    name={'employer.nationalRegistryId'}
                    label={'Social security nr of employer'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'employer.contact'}
                    name={'employer.contact'}
                    label={'Contact name'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'employer.contactId'}
                    name={'employer.contactId'}
                    label={'Contact social security nr'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          {/* TODO: Calculate this dynamically when Arni's PR gets merged */}
          <AccordionItem id="id_4" label="Your leave rights">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <BoxChart
                    boxes={7}
                    titleLabel="Total: 7 months"
                    calculateBoxStyle={(index: number) => {
                      if (index === 6) return 'greenWithLines'
                      return 'blue'
                    }}
                    keys={[
                      {
                        label: '6 personal months',
                        bulletStyle: 'blue',
                      },
                      {
                        label: '1 granted month from other parent',
                        bulletStyle: 'greenWithLines',
                      },
                    ]}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          <AccordionItem id="id_4" label="Your periods">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Timeline
                    initDate={dobDate}
                    title="Expected birth date"
                    titleSmall="Birth date"
                    periods={formatPeriods(
                      application.answers.periods as Period[],
                      otherParentPeriods,
                    )}
                    onDeletePeriod={() => {
                      // TODO
                    }}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          <AccordionItem id="id_4" label="Payment plan">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Table
                    columns={columns}
                    data={data}
                    truncate
                    showMoreLabel={formatText(
                      m.salaryLabelShowMore,
                      application,
                      formatMessage,
                    )}
                    showLessLabel={formatText(
                      m.salaryLabelShowLess,
                      application,
                      formatMessage,
                    )}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          <AccordionItem id="id_4" label="Share information">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Box marginTop={1} marginBottom={2} marginLeft={4}>
                    <Text variant="h5">
                      Do you want to share your leave information with the other
                      parent?
                    </Text>
                  </Box>

                  <RadioController
                    emphasize={true}
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
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  )
}

export default Review
