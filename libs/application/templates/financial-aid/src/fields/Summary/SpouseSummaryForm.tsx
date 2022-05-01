import React, { useState } from 'react'

import { Box } from '@island.is/island-ui/core'

import * as m from '../../lib/messages'
import {
  ApproveOptions,
  FAFieldBaseProps,
  SummaryComment as SummaryCommentType,
} from '../../lib/types'
import { Routes } from '../../lib/constants'
import { DescriptionText, DirectTaxPaymentsModal } from '../index'
import { formatAddress, spouseFormItems } from '../../lib/formatters'
import {
  FormInfo,
  SummaryComment,
  UserInfo,
  ContactInfo,
  Files,
  DirectTaxPaymentCell,
} from './index'

const SpouseSummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.SPOUSEFORMCOMMENT

  const [isModalOpen, setIsModalOpen] = useState(false)

  const nationalId =
    externalData?.nationalRegistry?.data?.applicant?.spouse?.nationalId ||
    answers?.relationshipStatus?.spouseNationalId

  return (
    <>
      <Box>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      {/* TODO get name of spouse if unregistred */}
      <UserInfo
        name={externalData?.nationalRegistry?.data?.applicant?.spouse?.name}
        nationalId={nationalId}
        address={formatAddress(externalData?.nationalRegistry?.data?.applicant)}
      />

      <FormInfo items={spouseFormItems(answers)} goToScreen={goToScreen} />

      {externalData?.taxDataFetch && (
        <DirectTaxPaymentCell
          setIsModalOpen={setIsModalOpen}
          hasFetchedPayments={
            externalData?.taxDataFetch?.data?.municipalitiesDirectTaxPayments
              ?.success
          }
          directTaxPayments={
            externalData?.taxDataFetch?.data?.municipalitiesDirectTaxPayments
              ?.directTaxPayments
          }
        />
      )}

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
        personalTaxReturn={
          externalData?.taxDataFetchSpouse?.data
            ?.municipalitiesPersonalTaxReturn?.personalTaxReturn
        }
        taxFiles={answers.spouseTaxReturnFiles ?? []}
        incomeFiles={answers.spouseIncomeFiles ?? []}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={answers?.spouseFormComment}
      />

      {externalData?.taxDataFetch?.data?.municipalitiesDirectTaxPayments
        ?.directTaxPayments && (
        <DirectTaxPaymentsModal
          items={
            externalData?.taxDataFetch?.data?.municipalitiesDirectTaxPayments
              ?.directTaxPayments
          }
          dateDataWasFetched={externalData?.nationalRegistry?.date}
          isVisible={isModalOpen}
          onVisibilityChange={(isOpen: boolean) => {
            setIsModalOpen(isOpen)
          }}
        />
      )}
    </>
  )
}

export default SpouseSummaryForm
