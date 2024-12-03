import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import DescriptionText from '../../components/DescriptionText/DescriptionText'
import DirectTaxPaymentModal from '../../components/DirectTaxPaymentsModal/DirectTaxPaymentModal'
import ContactInfo from '../../components/Summary/ContactInfo'
import DirectTaxPaymentCell from '../../components/Summary/DirectTaxPaymentCell'
import Files from '../../components/Summary/Files'
import FormInfo from '../../components/Summary/FormInfo'
import SummaryComment from '../../components/Summary/SummaryComment'
import UserInfo from '../../components/Summary/UserInfo'
import { Routes } from '../../lib/constants'
import { formatAddress, spouseFormItems } from '../../lib/formatters'
import * as m from '../../lib/messages'
import { SummaryComment as SummaryCommentType } from '../../lib/types'
import { getSpouseSummaryConstants } from './utils'

export const SpouseSummaryForm = ({
  application,
  goToScreen,
}: FieldBaseProps) => {
  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.SPOUSEFORMCOMMENT

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setValue } = useFormContext()
  const userInfo = useUserInfo()

  useEffect(() => {
    setValue('spouseName', userInfo?.profile.name)
  }, [])

  const {
    nationalId,
    data,
    taxData,
    spouseEmail,
    spousePhone,
    route,
    personalTaxReturn,
    directTaxPayments,
    fetchDate,
    spouseTaxReturnFiles,
    spouseFormComment,
    spouseIncomeFiles,
  } = getSpouseSummaryConstants(answers, externalData)

  return (
    <>
      <Box>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <UserInfo
        name={userInfo?.profile.name}
        nationalId={nationalId}
        address={formatAddress(data)}
      />

      <FormInfo items={spouseFormItems(answers)} goToScreen={goToScreen} />

      {externalData?.taxDataSpouse && (
        <DirectTaxPaymentCell
          setIsModalOpen={setIsModalOpen}
          hasFetchedPayments={
            taxData?.municipalitiesDirectTaxPayments?.success ?? false
          }
          directTaxPayments={
            taxData?.municipalitiesDirectTaxPayments?.directTaxPayments ?? []
          }
        />
      )}

      <ContactInfo
        route={Routes.SPOUSECONTACTINFO}
        email={spouseEmail ?? ''}
        phone={spousePhone ?? ''}
        goToScreen={goToScreen}
      />

      <Files
        route={route}
        goToScreen={goToScreen}
        personalTaxReturn={personalTaxReturn}
        taxFiles={spouseTaxReturnFiles ?? []}
        incomeFiles={spouseIncomeFiles ?? []}
        childrenFiles={[]}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={spouseFormComment}
      />

      {directTaxPayments && (
        <DirectTaxPaymentModal
          items={directTaxPayments}
          dateDataWasFetched={fetchDate ?? ''}
          isVisible={isModalOpen}
          onVisibilityChange={(isOpen: boolean) => {
            setIsModalOpen(isOpen)
          }}
        />
      )}
    </>
  )
}
