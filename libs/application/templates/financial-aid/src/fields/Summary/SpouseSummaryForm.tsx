import React, { useState } from 'react'
import cn from 'classnames'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'

import { Box, Text } from '@island.is/island-ui/core'

import * as m from '../../lib/messages'
import {
  ApproveOptions,
  FAFieldBaseProps,
  SummaryComment as SummaryCommentType,
} from '../../lib/types'
import { Routes } from '../../lib/constants'
import { DescriptionText } from '../index'
import { formatAddress, spouseFormItems } from '../../lib/formatters'
import {
  FormInfo,
  SummaryComment,
  UserInfo,
  ContactInfo,
  Files,
  SummaryError,
} from './index'
import useApplication from '../../lib/hooks/useApplication'

const SpouseSummaryForm = ({
  application,
  goToScreen,
  setBeforeSubmitCallback,
}: FAFieldBaseProps) => {
  const { getValues } = useFormContext()
  const { createApplication } = useApplication()
  const [formError, setFormError] = useState(false)
  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.SPOUSEFORMCOMMENT

  if (setBeforeSubmitCallback) {
    setBeforeSubmitCallback(async () => {
      application.answers.spouseFormComment = getValues(summaryCommentType)
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
      <Box>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <UserInfo
        name={externalData?.nationalRegistry?.data?.applicant?.spouse?.name}
        nationalId={
          externalData?.nationalRegistry?.data?.applicant?.spouse?.nationalId
        }
        address={formatAddress(externalData?.nationalRegistry?.data?.applicant)}
      />

      <FormInfo items={spouseFormItems(answers)} goToScreen={goToScreen} />

      <ContactInfo
        route={Routes.SPOUSECONTACTINFO}
        email={answers?.spouseContactInfo?.email}
        phone={answers?.spouseContactInfo?.phone}
        goToScreen={goToScreen}
      />

      <Files
        route={
          answers.spouseIncome === ApproveOptions.Yes
            ? Routes.SPOUSEINCOMEFILES
            : Routes.SPOUSETAXRETURNFILES
        }
        goToScreen={goToScreen}
        taxFiles={answers.spouseTaxReturnFiles}
        incomeFiles={answers.spouseIncomeFiles}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={answers?.spouseFormComment}
      />

      <SummaryError error={formError} />
    </>
  )
}

export default SpouseSummaryForm
