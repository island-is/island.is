import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { FieldBaseProps } from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './Review.treat'
import { theme } from '@island.is/island-ui/theme'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { id } = field
  const { clearErrors } = useFormContext()

  // TODO: Get this info from somewhere...
  const isPrimaryParent = true
  const formValue = application.answers as {
    applicant: {
      email: string
      phoneNumber: string
    }
    usage: number
    spread: number
    payments: {
      bank: string
      union: string
      personalAllowanceUsage: number
      pensionFund: string
      privatePensionFund: string
      privatePensionFundPercentage: number
    }
    shareInformationWithOtherParent: 'yes' | 'no'
    usePrivatePensionFund: 'yes' | 'no'
    periods: [
      {
        start: string
        end: string
        ratio: number
      },
    ]
    employer: {
      name: string
      nationalRegistryId: string
    }
    requestExtraTime: 'yes' | 'no'
    giveExtraTime: 'yes' | 'no'
    singlePeriod: 'yes' | 'no'
    firstPeriodStart: string
    confirmLeaveDuration: string
    secondaryParentName: string
    secondaryParentId: string
  }

  const otherParentInfoAvailable =
    formValue.secondaryParentName && formValue.secondaryParentId

  return (
    <Box marginTop={4} marginBottom={6}>
      <Accordion singleExpand={false}>
        <AccordionItem id="id_1" label="Contact information">
          <Text variant="h4">Email</Text>
          <Text>{formValue.applicant.email}</Text>
          <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
            <Box>
              <Text variant="h4">Phone number</Text>
              <Text>{formValue.applicant.phoneNumber}</Text>
            </Box>
            <Button size="small" type="button">
              Edit
            </Button>
          </Box>
        </AccordionItem>

        {isPrimaryParent && otherParentInfoAvailable && (
          <AccordionItem id="id_4" label="Other parent">
            <Text variant="h4">Name</Text>
            <Text>{formValue.secondaryParentName}</Text>
            <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
              <Box>
                <Text variant="h4">National ID</Text>
                <Text>{formValue.secondaryParentId}</Text>
              </Box>
              <Button size="small" type="button">
                Edit
              </Button>
            </Box>
          </AccordionItem>
        )}
        {isPrimaryParent && !otherParentInfoAvailable && (
          <AccordionItem id="id_4" label="Other parent">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              marginTop={3}
            >
              <Box>
                <Text>
                  <em>Not specified at this moment</em>
                </Text>
              </Box>
              <Button size="small" type="button">
                Edit
              </Button>
            </Box>
          </AccordionItem>
        )}

        <AccordionItem id="id_3" label="Employer">
          <Text variant="h4">Name</Text>
          <Text>{formValue.employer.name}</Text>
          <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
            <Box>
              <Text variant="h4">National ID</Text>
              <Text>{formValue.employer.nationalRegistryId}</Text>
            </Box>
            <Button size="small" type="button">
              Edit
            </Button>
          </Box>
        </AccordionItem>

        <AccordionItem id="id_3" label="Payment details" startExpanded>
          <Text variant="h4">Bank</Text>
          <Text>{formValue.payments.bank}</Text>

          <Text variant="h4">Personal allowance usage</Text>
          <Text>{formValue.payments.personalAllowanceUsage}</Text>

          <Text variant="h4">Pension fund (optional)</Text>
          <Text>{formValue.payments.pensionFund}</Text>

          <Text variant="h4">Union (optional)</Text>
          <Text>{formValue.payments.union}</Text>

          <Text variant="h4">
            Do you wish to pay to a private pension fund?
          </Text>
          <Text>{formValue.usePrivatePensionFund}</Text>

          {formValue.usePrivatePensionFund === 'yes' && (
            <>
              <Text variant="h4">Private pension fund</Text>
              <Text>{formValue.payments.privatePensionFund}</Text>

              <Text variant="h4">Private pension fund %</Text>
              <Text>{formValue.payments.privatePensionFundPercentage}</Text>
            </>
          )}

          <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
            <Box>
              <Text variant="h4">National ID</Text>
              <Text>{formValue.employer.nationalRegistryId}</Text>
            </Box>
            <Button size="small" type="button">
              Edit
            </Button>
          </Box>
        </AccordionItem>

        <AccordionItem id="id_2" label="Your leave rights">
          <Text>
            Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
            faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
            frumritið.
          </Text>
        </AccordionItem>

        <AccordionItem id="id_5" label="Leave periods">
          <Text>
            Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
            faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
            frumritið.
          </Text>
        </AccordionItem>
        <AccordionItem id="id_6" label="Payments">
          <Text>
            Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
            faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
            frumritið.
          </Text>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default Review
