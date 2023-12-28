import React, { useState, useMemo } from 'react'
import cn from 'classnames'
import format from 'date-fns/format'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  Application,
  ApplicationState,
  aidCalculator,
  getMonth,
  calculateAidFinalAmount,
  showSpouseData,
  AmountModal,
  getAidAmountModalInfo,
  UserType,
  ApplicationProfileInfo,
  Municipality,
  DirectTaxPayment,
} from '@island.is/financial-aid/shared/lib'

import {
  CollapsibleProfileUnit,
  ProfileUnit,
  StateModal,
  AidAmountModal,
  History,
  CommentSection,
  ApplicationHeader,
  FilesListWithHeaderContainer,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  getApplicant,
  getApplicantMoreInfo,
  getApplicantSpouse,
  getDirectTaxPayments,
  getNationalRegistryInfo,
} from '@island.is/financial-aid-web/veita/src/utils/applicationHelper'
import { TaxBreakdown } from '@island.is/financial-aid/shared/components'

import * as styles from './Profile.css'

interface ApplicationProps {
  application: Application
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isPrint?: boolean
  applicationMunicipality: Municipality
}

interface CalculationsModal {
  visible: boolean
  type: AmountModal
}

const ApplicationProfile = ({
  application,
  setApplication,
  setIsLoading,
  isPrint = false,
  applicationMunicipality,
}: ApplicationProps) => {
  const [isStateModalVisible, setStateModalVisible] = useState(false)

  const [calculationsModal, setCalculationsModal] = useState<CalculationsModal>(
    {
      visible: false,
      type: AmountModal.ESTIMATED,
    },
  )

  const aidAmount = useMemo(() => {
    if (applicationMunicipality && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        showSpouseData[application.familyStatus]
          ? applicationMunicipality.cohabitationAid
          : applicationMunicipality.individualAid,
      )
    }
  }, [applicationMunicipality, application])

  const applicationInfo: ApplicationProfileInfo[] = [
    {
      title: 'Tímabil',
      content:
        getMonth(new Date(application.created).getMonth()) +
        format(new Date(application.created), ' y'),
    },
    {
      title: 'Sótt um',
      content: format(new Date(application.created), 'dd.MM.y  · kk:mm'),
    },
    aidAmount
      ? {
          title: 'Áætluð aðstoð',
          content: `${calculateAidFinalAmount(
            aidAmount,
            application.usePersonalTaxCredit,
          ).toLocaleString('de-DE')} kr.`,
          onclick: () => {
            setCalculationsModal({ visible: true, type: AmountModal.ESTIMATED })
          },
        }
      : {
          title: 'Áætluð aðstoð',
          content: `Útreikningur misstókst`,
        },
  ]

  if (application.state === ApplicationState.APPROVED) {
    applicationInfo.push({
      title: 'Veitt aðstoð',
      content: `${application.amount?.finalAmount.toLocaleString('de-DE')} kr.`,
      onclick: () => {
        setCalculationsModal({ visible: true, type: AmountModal.PROVIDED })
      },
    })
  }
  if (application.state === ApplicationState.REJECTED) {
    applicationInfo.push({
      title: 'Aðstoð synjað',
      content: application?.rejection
        ? application?.rejection
        : 'enginn ástæða gefin',
      fullWidth: true,
    })
  }

  const applicant = getApplicant(application)

  const applicantSpouse = getApplicantSpouse(application)

  const applicantMoreInfo = getApplicantMoreInfo(application)

  const nationalRegistryInfo = getNationalRegistryInfo(application)

  const modalInfo = getAidAmountModalInfo(
    calculationsModal.type,
    aidAmount,
    application.usePersonalTaxCredit,
    application?.amount,
  )

  const applicantDirectPayments =
    application.directTaxPayments.filter(
      (d) => d.userType === UserType.APPLICANT,
    ) ?? []

  const spouseDirectPayments =
    application.directTaxPayments.filter(
      (d) => d.userType === UserType.SPOUSE,
    ) ?? []

  return (
    <>
      <Box
        marginTop={isPrint ? 1 : 10}
        marginBottom={isPrint ? 4 : 15}
        className={`${styles.applicantWrapper}`}
      >
        <ApplicationHeader
          application={application}
          onClickApplicationState={() => {
            setStateModalVisible((isStateModalVisible) => !isStateModalVisible)
          }}
          setApplication={setApplication}
          setIsLoading={setIsLoading}
          isPrint={isPrint}
        />

        {application.navSuccess === false && (
          <Box
            className={cn({
              [`${styles.widthFull} `]: true,
            })}
            marginBottom={[5, 5, 7]}
          >
            <AlertMessage
              type="warning"
              message={
                <Text variant="medium">
                  Sjálfvirk yfirfærsla í Navision tókst ekki.
                </Text>
              }
            />
          </Box>
        )}

        <ProfileUnit
          heading="Umsókn"
          info={applicationInfo}
          className={`contentUp delay-50`}
        />

        <ProfileUnit
          heading="Umsækjandi"
          info={applicant}
          className={`contentUp delay-75`}
        />

        <CollapsibleProfileUnit
          heading="Upplýsingar um staðgreiðslu"
          info={getDirectTaxPayments(applicantDirectPayments)}
          className={`contentUp delay-75`}
          isPrint={isPrint}
        >
          {getDirectTaxPaymentsContent(
            applicantDirectPayments,
            application.hasFetchedDirectTaxPayment,
            application.created,
          )}
        </CollapsibleProfileUnit>

        {showSpouseData[application.familyStatus] && (
          <>
            <CollapsibleProfileUnit
              heading="Maki"
              info={applicantSpouse}
              className={`contentUp delay-100`}
              isPrint={isPrint}
            />

            <CollapsibleProfileUnit
              heading="Upplýsingar um staðgreiðslu maka"
              info={getDirectTaxPayments(spouseDirectPayments)}
              className={`contentUp delay-125`}
              isPrint={isPrint}
            >
              {getDirectTaxPaymentsContent(
                spouseDirectPayments,
                application.spouseHasFetchedDirectTaxPayment,
                application.created,
              )}
            </CollapsibleProfileUnit>
          </>
        )}

        <CollapsibleProfileUnit
          heading="Umsóknarferli"
          info={applicantMoreInfo}
          className={`contentUp delay-125`}
          isPrint={isPrint}
        />

        <CollapsibleProfileUnit
          heading="Þjóðskrá"
          info={nationalRegistryInfo}
          className={`contentUp delay-125`}
          isPrint={isPrint}
        />

        {application.files && (
          <FilesListWithHeaderContainer applicationFiles={application.files} />
        )}

        {!isPrint && (
          <CommentSection
            className={`contentUp delay-125 ${styles.widthAlmostFull}`}
            setApplication={setApplication}
          />
        )}

        <History
          applicantName={application.name}
          applicantEmail={application.email}
          applicationEvents={application.applicationEvents}
          spouseName={application.spouseName ?? ''}
        />
      </Box>
      {application.state && (
        <StateModal
          isVisible={isStateModalVisible}
          onVisibilityChange={(isVisibleBoolean) => {
            setStateModalVisible(isVisibleBoolean)
          }}
          setApplication={setApplication}
          applicationId={application.id}
          currentState={application.state}
          homeCircumstances={application.homeCircumstances}
          familyStatus={application.familyStatus}
          setIsLoading={setIsLoading}
          applicationCreated={application.created}
          applicationMunicipality={applicationMunicipality}
        />
      )}

      <AidAmountModal
        headline={modalInfo.headline}
        calculations={modalInfo.calculations}
        isVisible={calculationsModal.visible}
        onVisibilityChange={() => {
          setCalculationsModal({ ...calculationsModal, visible: false })
        }}
      />
    </>
  )
}

export default ApplicationProfile

export const getDirectTaxPaymentsContent = (
  directPaymentsArr: DirectTaxPayment[],
  hasFetchedPayments: boolean,
  applicationCreated: string,
) => {
  switch (true) {
    case directPaymentsArr.length > 0:
      return (
        <TaxBreakdown
          items={directPaymentsArr}
          dateDataWasFetched={applicationCreated}
        />
      )
    case directPaymentsArr.length === 0 && hasFetchedPayments:
      return (
        <Text marginBottom={4}>
          Engar upplýsingar um staðgreiðslu fundust hjá Skattinum
        </Text>
      )
    case directPaymentsArr.length === 0 && !hasFetchedPayments:
      return (
        <Text marginBottom={4} color="red400">
          Ekki tókst að sækja staðgreiðslu
        </Text>
      )
  }
}
