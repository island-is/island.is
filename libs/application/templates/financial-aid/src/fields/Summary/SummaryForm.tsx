import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import {
  getNextPeriod,
  estimatedBreakDown,
  aidCalculator,
  FamilyStatus,
} from '@island.is/financial-aid/shared/lib'
import { useLocale } from '@island.is/localization'

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
import { findFamilyStatus } from '../../lib/utils'
import withLogo from '../Logo/Logo'

const SummaryForm = ({
  application,
  goToScreen,
}: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.FORMCOMMENT

  const [isModalOpen, setIsModalOpen] = useState(false)

  const aidAmount = useMemo(() => {
    if (externalData.municipality.data && answers.homeCircumstances) {
      return aidCalculator(
        answers.homeCircumstances.type,
        findFamilyStatus(answers, externalData) ===
          FamilyStatus.NOT_COHABITATION
          ? externalData.municipality.data.individualAid
          : externalData.municipality.data.cohabitationAid,
      )
    }
  }, [externalData.municipality.data])

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
            nextMonth: getNextPeriod(lang).month,
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
        name={externalData.nationalRegistry.data.fullName}
        nationalId={externalData.nationalRegistry.data.nationalId}
        address={formatAddress(externalData.nationalRegistry.data)}
      />

      <FormInfo
        items={formItems(answers, externalData)}
        goToScreen={goToScreen}
      />

      <DirectTaxPaymentCell
        setIsModalOpen={setIsModalOpen}
        hasFetchedPayments={
          externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.success
        }
        directTaxPayments={
          externalData?.taxData?.data?.municipalitiesDirectTaxPayments
            ?.directTaxPayments
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
          externalData.taxData?.data?.municipalitiesPersonalTaxReturn
            ?.personalTaxReturn
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
          externalData?.taxData?.data?.municipalitiesDirectTaxPayments
            ?.directTaxPayments
        }
        dateDataWasFetched={externalData?.nationalRegistry?.date}
        isVisible={isModalOpen}
        onVisibilityChange={(isOpen: boolean) => {
          setIsModalOpen(isOpen)
        }}
      />
    </>
  )
}

export default withLogo(SummaryForm)
