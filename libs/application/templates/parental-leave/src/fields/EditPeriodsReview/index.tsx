import React, { FC, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Application,
  getValueViaPath,
  ValidAnswers,
  formatAndParseAsHTML,
  buildFieldOptions,
} from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import {
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'

import Timeline from '../components/Timeline'
import {
  formatPeriods,
  getExpectedDateOfBirth,
  getOtherParentOptions,
} from '../../parentalLeaveUtils'
import { Period } from '../../types'
import PaymentsTable from '../PaymentSchedule/PaymentsTable'
import YourRightsBoxChart from '../Rights/YourRightsBoxChart'
import { getEstimatedPayments } from '../PaymentSchedule/estimatedPaymentsQuery'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES, NO } from '../../constants'

type ValidOtherParentAnswer = 'no' | 'manual' | undefined

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
    ValidAnswers
  >(
    getValueViaPath(
      application.answers,
      'usePrivatePensionFund',
    ) as ValidAnswers,
  )

  const otherParentOptions = useMemo(
    () => buildFieldOptions(getOtherParentOptions(application), application),
    [application],
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
              ? `${formatMessage(
                  parentalLeaveFormMessages.confirmation.collapseAll,
                )}`
              : `${formatMessage(
                  parentalLeaveFormMessages.confirmation.epxandAll,
                )}`}
          </Button>
        </Box>

        <Accordion singleExpand={false}>
          <AccordionItem
            id="id_4"
            label={formatMessage(
              parentalLeaveFormMessages.shared.periodsSection,
            )}
            startExpanded={allItemsExpanded}
          >
            <Box paddingY={4}>
              <Timeline
                initDate={dobDate}
                title={formatMessage(
                  parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
                )}
                titleSmall={formatMessage(
                  parentalLeaveFormMessages.shared.dateOfBirthTitle,
                )}
                periods={formatPeriods(
                  application.answers.tempPeriods as Period[],
                  otherParentPeriods,
                )}
              />
              {editable && (
                <Box paddingTop={3}>
                  <Button
                    size="small"
                    onClick={() => goToScreen?.('tempPeriods')}
                  >
                    {formatMessage(parentalLeaveFormMessages.leavePlan.change)}
                  </Button>
                </Box>
              )}
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  )
}

export default Review
