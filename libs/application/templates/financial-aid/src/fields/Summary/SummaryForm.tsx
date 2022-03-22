import React, { useState, useMemo } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import { Text, Box } from '@island.is/island-ui/core'
import {
  getNextPeriod,
  estimatedBreakDown,
  aidCalculator,
  martialStatusTypeFromMartialCode,
  MartialStatusType,
} from '@island.is/financial-aid/shared/lib'

import * as m from '../../lib/messages'
import {
  ApproveOptions,
  FAFieldBaseProps,
  SummaryComment as SummaryCommentType,
} from '../../lib/types'
import { Routes } from '../../lib/constants'
import { DescriptionText, Breakdown } from '../index'
import { formatAddress, formItems } from '../../lib/formatters'
import useApplication from '../../lib/hooks/useApplication'
import * as styles from '../Shared.css'
import { hasSpouse } from '../../lib/utils'
import { FormInfo, SummaryComment, UserInfo, ContactInfo, Files } from './index'

const SummaryForm = ({
  application,
  goToScreen,
  setBeforeSubmitCallback,
}: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { createApplication } = useApplication()
  const [formError, setFormError] = useState(false)
  const { id, answers, externalData } = application

  const aidAmount = useMemo(() => {
    if (
      externalData.nationalRegistry?.data?.municipality &&
      answers.homeCircumstances
    ) {
      return aidCalculator(
        answers.homeCircumstances.type,
        martialStatusTypeFromMartialCode(
          externalData.nationalRegistry?.data?.applicant?.spouse?.maritalStatus,
        ) === MartialStatusType.SINGLE
          ? externalData.nationalRegistry?.data?.municipality?.individualAid
          : externalData.nationalRegistry?.data?.municipality?.cohabitationAid,
      )
    }
  }, [externalData.nationalRegistry?.data?.municipality])

  if (!hasSpouse(answers, externalData)) {
    setBeforeSubmitCallback &&
      setBeforeSubmitCallback(async () => {
        const createApp = await createApplication(application)
          .then(() => {
            return true
          })
          .catch(() => {
            setFormError(true)
            return false
          })
        if (createApp) {
          return [true, null]
        }
        return [false, 'Failed to create application']
      })
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        marginTop={[2, 2, 4]}
      >
        <Box marginRight={1}>
          <Text as="h3" variant="h3">
            {formatMessage(m.summaryForm.general.descriptionTitle)}
          </Text>
        </Box>

        <Text variant="small">
          {formatMessage(m.summaryForm.general.descriptionSubtitle, {
            nextMonth: getNextPeriod.month,
          })}
        </Text>
      </Box>

      <Box marginTop={2}>
        <DescriptionText text={m.summaryForm.general.description} />
      </Box>

      {aidAmount && (
        <Box marginTop={[4, 4, 5]}>
          <Breakdown
            calculations={estimatedBreakDown(
              aidAmount,
              answers.personalTaxCredit === ApproveOptions.Yes,
            )}
          />
        </Box>
      )}

      <Box marginTop={[4, 4, 5]}>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <UserInfo
        name={externalData?.nationalRegistry?.data?.applicant?.fullName}
        nationalId={externalData?.nationalRegistry?.data?.applicant?.nationalId}
        address={formatAddress(externalData?.nationalRegistry?.data?.applicant)}
      />

      <FormInfo
        items={formItems(answers, externalData)}
        goToScreen={goToScreen}
      />

      <ContactInfo
        route={Routes.CONTACTINFO}
        email={answers?.contactInfo?.email}
        phone={answers?.contactInfo?.phone}
        goToScreen={goToScreen}
      />

      <Files
        route={
          answers.income === ApproveOptions.Yes
            ? Routes.INCOMEFILES
            : Routes.TAXRETURNFILES
        }
        goToScreen={goToScreen}
        taxFiles={answers.taxReturnFiles}
        incomeFiles={answers.incomeFiles}
        applicationId={id}
      />

      <SummaryComment
        commentId={SummaryCommentType.FORMCOMMENT}
        comment={answers?.formComment}
      />

      <Box
        className={cn(styles.errorMessage, {
          [`${styles.showErrorMessage}`]: formError,
        })}
      >
        <Text color="red600" fontWeight="semiBold" variant="small">
          {formatMessage(m.summaryForm.general.errorMessage)}
        </Text>
      </Box>
    </>
  )
}

export default SummaryForm
