import React, { useEffect, useState } from 'react'
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
import { useFormContext } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'

const SpouseSummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.SPOUSEFORMCOMMENT

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setValue } = useFormContext()

  const nationalId =
    externalData.nationalRegistrySpouse.data?.nationalId ||
    answers?.relationshipStatus?.spouseNationalId
  const userInfo = useUserInfo()

  useEffect(() => {
    setValue('spouseName', userInfo?.profile.name)
  }, [])

  return (
    <>
      <Box>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <UserInfo
        name={userInfo?.profile.name}
        nationalId={nationalId}
        address={formatAddress(externalData.nationalRegistry.data)}
      />

      <FormInfo items={spouseFormItems(answers)} goToScreen={goToScreen} />

      {externalData?.taxDataSpouse && (
        <DirectTaxPaymentCell
          setIsModalOpen={setIsModalOpen}
          hasFetchedPayments={
            externalData?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
              ?.success
          }
          directTaxPayments={
            externalData?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
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
          externalData?.taxDataSpouse?.data?.municipalitiesPersonalTaxReturn
            ?.personalTaxReturn
        }
        taxFiles={answers.spouseTaxReturnFiles ?? []}
        incomeFiles={answers.spouseIncomeFiles ?? []}
        childrenFiles={[]}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={answers?.spouseFormComment}
      />

      {externalData?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
        ?.directTaxPayments && (
        <DirectTaxPaymentsModal
          items={
            externalData?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
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
