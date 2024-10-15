import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Text, Box, AlertMessage, UploadFile } from '@island.is/island-ui/core'
import {
  getNextPeriod,
  estimatedBreakDown,
  aidCalculator,
  FamilyStatus,
  ChildrenAid,
  HomeCircumstances,
  Aid,
  DirectTaxPayment,
} from '@island.is/financial-aid/shared/lib'
import { useLocale } from '@island.is/localization'
import * as m from '../../lib/messages'
import {
  ApproveOptions,
  ChildrenSchoolInfo,
  SummaryComment as SummaryCommentType,
} from '../../lib/types'
import { Routes } from '../../lib/constants'
import { formatAddress, formItems } from '../../lib/formatters'
import { findFamilyStatus } from '../../lib/utils'
import DescriptionText from '../../components/DescriptionText/DescriptionText'
import Breakdown from '../../components/Breakdown/Breakdown'
import DirectTaxPaymentModal from '../../components/DirectTaxPaymentsModal/DirectTaxPaymentModal'
import SummaryComment from '../../components/Summary/SummaryComment'
import ChildrenInfo from '../../components/Summary/ChildrenInfo'
import ContactInfo from '../../components/Summary/ContactInfo'
import Files from '../../components/Summary/Files'
import FormInfo from '../../components/Summary/FormInfo'
import DirectTaxPaymentCell from '../../components/Summary/DirectTaxPaymentCell'
import UserInfo from '../../components/Summary/UserInfo'
import {
  ApplicantChildCustodyInformation,
  FieldBaseProps,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { AnswersSchema } from '../../lib/dataSchema'

const SummaryForm = ({ application, goToScreen }: FieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  const { id, answers, externalData } = application
  const answersSchema = answers as AnswersSchema
  const summaryCommentType = SummaryCommentType.FORMCOMMENT
  const [isModalOpen, setIsModalOpen] = useState(false)

  const homeCircumstances = getValueViaPath(
    answers,
    'homeCircumstances.type',
  ) as HomeCircumstances

  const individualAid = getValueViaPath(
    externalData,
    'municipality.data.individualAid',
  ) as Aid

  const cohabitationAid = getValueViaPath(
    externalData,
    'municipality.data.cohabitationAid',
  ) as Aid

  const aidAmount = useMemo(() => {
    if (externalData.municipality.data && answers.homeCircumstances) {
      return aidCalculator(
        homeCircumstances,
        findFamilyStatus(answers, externalData) ===
          FamilyStatus.NOT_COHABITATION
          ? individualAid
          : cohabitationAid,
      )
    }
  }, [externalData.municipality.data])

  const childrenCustodyData = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
  ) as Array<ApplicantChildCustodyInformation>

  const childrenAid = getValueViaPath(
    externalData,
    'municipality.data.childrenAid',
  ) as ChildrenAid

  const nationalRegistryData = getValueViaPath(
    externalData,
    'nationalRegistry.data',
  ) as NationalRegistryIndividual

  const showAlertMessageAboutChildrenAid =
    childrenCustodyData?.length > 0 && childrenAid !== ChildrenAid.NOTDEFINED

  const personalTaxCreditType = getValueViaPath(
    answers,
    'personalTaxCredit.type',
  ) as ApproveOptions

  const findFilesRouteFrom = (
    childrenFiles: UploadFile[],
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

  const childrenSchoolInfo = getValueViaPath(
    answers,
    'childrenSchoolInfo',
  ) as Array<ChildrenSchoolInfo>

  const municipalitiesDirectTaxPaymentsSuccess = getValueViaPath(
    externalData,
    'taxData.data.municipalitiesDirectTaxPayments.success',
  ) as boolean

  const municipalitiesDirectTaxPayments = getValueViaPath(
    externalData,
    'taxData.data.municipalitiesDirectTaxPayments.directTaxPayments',
  ) as Array<DirectTaxPayment>

  const fetchDate = getValueViaPath(
    externalData,
    'nationalRegistry.date',
  ) as string

  const personalTaxReturn = getValueViaPath(
    externalData,
    'taxData.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
  ) as UploadFile

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
              personalTaxCreditType === ApproveOptions.Yes,
            )}
          />
        </Box>
      )}

      {showAlertMessageAboutChildrenAid && (
        <Box marginTop={[4, 4, 5]}>
          {childrenAid === ChildrenAid.APPLICANT ? (
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
        name={nationalRegistryData.fullName}
        nationalId={nationalRegistryData.nationalId}
        address={formatAddress(nationalRegistryData)}
      />

      {childrenSchoolInfo && childrenSchoolInfo.length > 0 && (
        <ChildrenInfo
          childrenSchoolInfo={childrenSchoolInfo}
          goToScreen={goToScreen}
          childrenComment={answers?.childrenComment as string | undefined}
        />
      )}

      <FormInfo
        items={formItems(answers, externalData)}
        goToScreen={goToScreen}
      />

      <DirectTaxPaymentCell
        setIsModalOpen={setIsModalOpen}
        hasFetchedPayments={municipalitiesDirectTaxPaymentsSuccess}
        directTaxPayments={municipalitiesDirectTaxPayments}
      />

      <ContactInfo
        route={Routes.CONTACTINFO}
        email={answersSchema?.contactInfo?.email}
        phone={answersSchema?.contactInfo?.phone}
        goToScreen={goToScreen}
      />

      <Files
        route={
          findFilesRouteFrom(
            answersSchema?.childrenFiles ?? [],
            answersSchema?.income?.type,
          ) || []
        }
        goToScreen={goToScreen}
        personalTaxReturn={personalTaxReturn}
        taxFiles={answersSchema?.taxReturnFiles ?? []}
        incomeFiles={answersSchema?.incomeFiles ?? []}
        childrenFiles={answersSchema?.childrenFiles ?? []}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={answersSchema?.formComment}
      />

      <DirectTaxPaymentModal
        items={municipalitiesDirectTaxPayments}
        dateDataWasFetched={fetchDate}
        isVisible={isModalOpen}
        onVisibilityChange={(isOpen: boolean) => {
          setIsModalOpen(isOpen)
        }}
      />
    </>
  )
}

export default SummaryForm
