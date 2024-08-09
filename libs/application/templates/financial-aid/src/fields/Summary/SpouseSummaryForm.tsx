import React, { useEffect, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import * as m from '../../lib/messages'
import {
  ApproveOptions,
  FAFieldBaseProps,
  SummaryComment as SummaryCommentType,
} from '../../lib/types'
import { Routes } from '../../lib/constants'
import { formatAddress, spouseFormItems } from '../../lib/formatters'
import { useFormContext } from 'react-hook-form'
import DescriptionText from '../../components/DescriptionText/DescriptionText'
import DirectTaxPaymentModal from '../../components/DirectTaxPaymentsModal/DirectTaxPaymentModal'
import SummaryComment from '../../components/Summary/SummaryComment'
import ContactInfo from '../../components/Summary/ContactInfo'
import Files from '../../components/Summary/Files'
import FormInfo from '../../components/Summary/FormInfo'
import DirectTaxPaymentCell from '../../components/Summary/DirectTaxPaymentCell'
import UserInfo from '../../components/Summary/UserInfo'

const SpouseSummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.SPOUSEFORMCOMMENT

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setValue } = useFormContext()

  const nationalId =
    externalData.nationalRegistrySpouse.data?.nationalId ||
    answers?.relationshipStatus?.spouseNationalId

  const { userInfo } = useAuth()
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
          answers.spouseIncome.type === ApproveOptions.Yes
            ? Routes.SPOUSEINCOMEFILES
            : Routes.SPOUSETAXRETURNFILES
        }
        goToScreen={goToScreen}
        personalTaxReturn={
          externalData?.taxDataSpouse?.data?.municipalitiesPersonalTaxReturn
            ?.personalTaxReturn
        }
        taxFiles={answers?.spouseTaxReturnFiles ?? []}
        incomeFiles={answers?.spouseIncomeFiles ?? []}
        childrenFiles={[]}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={answers?.spouseFormComment}
      />

      {externalData?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
        ?.directTaxPayments && (
        <DirectTaxPaymentModal
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
