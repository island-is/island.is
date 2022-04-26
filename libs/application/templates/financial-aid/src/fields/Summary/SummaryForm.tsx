import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
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
import {
  FormInfo,
  SummaryComment,
  UserInfo,
  ContactInfo,
  Files,
  DirectTaxPaymentCell,
} from './index'

import { DirectTaxPaymentsModal } from '..'

const SummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.FORMCOMMENT

  const [isModalOpen, setIsModalOpen] = useState(false)

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

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap">
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

      <DirectTaxPaymentCell
        setIsModalOpen={setIsModalOpen}
        hasFetchedPayments={
          externalData?.nationalRegistry?.data?.taxData
            ?.municipalitiesDirectTaxPayments?.success
        }
        directTaxPayments={
          externalData?.nationalRegistry?.data?.taxData
            ?.municipalitiesDirectTaxPayments?.directTaxPayments
        }
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
        personalTaxReturn={
          externalData.nationalRegistry?.data?.taxData
            ?.municipalitiesPersonalTaxReturn?.personalTaxReturn
        }
        taxFiles={answers.taxReturnFiles ?? []}
        incomeFiles={answers.incomeFiles ?? []}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={answers?.formComment}
      />

      <DirectTaxPaymentsModal
        items={
          externalData?.nationalRegistry?.data?.taxData
            ?.municipalitiesDirectTaxPayments?.directTaxPayments
        }
        dateDataWasFetched={externalData?.nationalRegistry?.date}
        isVisible={isModalOpen}
        onVisibilityChange={(isOpen) => {
          setIsModalOpen(isOpen)
        }}
      />
    </>
  )
}

export default SummaryForm
