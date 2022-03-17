import React from 'react'

import { Box } from '@island.is/island-ui/core'

import * as m from '../../lib/messages'
import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import { Routes } from '../../lib/constants'
import { DescriptionText } from '../index'
import {
  formatAddress,
  getMessageApproveOptionsForIncome,
} from '../../lib/formatters'
import FormInfo from './FormInfo'
import ContactInfo from './ContactInfo'
import UserInfo from './UserInfo'
import Comment from './Comment'
import Files from './Files'

const SummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { id, answers, externalData } = application
  const formItems = [
    {
      route: Routes.SPOUSEINCOME,
      label: m.incomeForm.general.sectionTitle,
      info: getMessageApproveOptionsForIncome[answers?.spouseIncome],
    },
  ]

  return (
    <>
      <Box marginTop={[4, 4, 5]}>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <UserInfo
        name={
          externalData?.nationalRegistry?.data?.applicant?.spouse?.name ?? ''
        }
        nationalId={
          externalData?.nationalRegistry?.data?.applicant?.spouse?.nationalId ??
          ''
        }
        address={
          formatAddress(externalData?.nationalRegistry?.data?.applicant) ?? ''
        }
      />

      <FormInfo items={formItems} goToScreen={goToScreen} />

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

      <Comment
        commentId="spouseFormComment"
        comment={answers?.spouseFormComment ?? ''}
      />
    </>
  )
}

export default SummaryForm
