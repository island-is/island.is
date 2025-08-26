import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Text,
  Box,
  AlertMessage,
  UploadFileDeprecated,
} from '@island.is/island-ui/core'
import {
  getNextPeriod,
  estimatedBreakDown,
  aidCalculator,
  FamilyStatus,
  ChildrenAid,
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
import ChildrenInfo from './ChildrenInfo'

const SummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
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

  const showAlertMessageAboutChildrenAid =
    externalData.childrenCustodyInformation.data.length > 0 &&
    externalData.municipality.data?.childrenAid !== ChildrenAid.NOTDEFINED

  const findFilesRouteFrom = (
    childrenFiles: UploadFileDeprecated[],
    income: ApproveOptions,
  ) => {
    if (childrenFiles?.length > 0) {
      return Routes.CHILDRENFILES
    }
    if (income === ApproveOptions.Yes) {
      return Routes.INCOMEFILES
    }

    return Routes.TAXRETURNFILES
  }

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

      {showAlertMessageAboutChildrenAid && (
        <Box marginTop={[4, 4, 5]}>
          {externalData.municipality.data?.childrenAid ===
          ChildrenAid.APPLICANT ? (
            <AlertMessage
              type="info"
              message={
                <Text variant="medium">
                  {formatMessage(m.summaryForm.childrenAidAlert.aidGoesToUser)}
                </Text>
              }
            />
          ) : (
            <AlertMessage
              type="info"
              message={
                <Text variant="medium">
                  {formatMessage(
                    m.summaryForm.childrenAidAlert.aidGoesToInstution,
                  )}
                </Text>
              }
            />
          )}
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

      {answers?.childrenSchoolInfo && answers.childrenSchoolInfo.length > 0 && (
        <ChildrenInfo
          childrenSchoolInfo={answers?.childrenSchoolInfo}
          goToScreen={goToScreen}
          childrenComment={answers?.childrenComment}
        />
      )}

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
        route={findFilesRouteFrom(answers.childrenFiles, answers.income)}
        goToScreen={goToScreen}
        personalTaxReturn={
          externalData.taxData?.data?.municipalitiesPersonalTaxReturn
            ?.personalTaxReturn
        }
        taxFiles={answers.taxReturnFiles ?? []}
        incomeFiles={answers.incomeFiles ?? []}
        childrenFiles={answers.childrenFiles ?? []}
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

export default SummaryForm
