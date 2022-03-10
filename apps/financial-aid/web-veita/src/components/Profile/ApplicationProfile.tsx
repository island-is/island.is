import React, { useState, useMemo, useContext } from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './Profile.css'

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
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

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
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import {
  getApplicant,
  getApplicantMoreInfo,
  getApplicantSpouse,
  getDirectTaxPayments,
  getNationalRegistryInfo,
} from '@island.is/financial-aid-web/veita/src/utils/applicationHelper'
import { TaxBreakdown } from '@island.is/financial-aid/shared/components'

interface ApplicationProps {
  application: Application
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

interface CalculationsModal {
  visible: boolean
  type: AmountModal
}

const ApplicationProfile = ({
  application,
  setApplication,
  setIsLoading,
}: ApplicationProps) => {
  const [isStateModalVisible, setStateModalVisible] = useState(false)

  const [calculationsModal, setCalculationsModal] = useState<CalculationsModal>(
    {
      visible: false,
      type: AmountModal.ESTIMATED,
    },
  )

  const { municipality } = useContext(AdminContext)

  const aidAmount = useMemo(() => {
    if (application && municipality && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        showSpouseData[application.familyStatus]
          ? municipality.cohabitationAid
          : municipality.individualAid,
      )
    }
  }, [application, municipality])

  const applicationInfo = [
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
      title: 'Veitt',
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
        marginTop={10}
        marginBottom={15}
        className={`${styles.applicantWrapper} hideOnPrintMarginBottom hideOnPrintMarginTop`}
      >
        <ApplicationHeader
          application={application}
          onClickApplicationState={() => {
            setStateModalVisible((isStateModalVisible) => !isStateModalVisible)
          }}
          setApplication={setApplication}
          setIsLoading={setIsLoading}
        />

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

        {applicantDirectPayments.length > 0 && (
          <CollapsibleProfileUnit
            heading="Upplýsingar um staðgreiðslu"
            info={getDirectTaxPayments(applicantDirectPayments)}
            className={`contentUp delay-75`}
          >
            <TaxBreakdown items={applicantDirectPayments} />
          </CollapsibleProfileUnit>
        )}

        {showSpouseData[application.familyStatus] && (
          <CollapsibleProfileUnit
            heading="Maki"
            info={applicantSpouse}
            className={`contentUp delay-100`}
          />
        )}

        {spouseDirectPayments.length > 0 && (
          <CollapsibleProfileUnit
            heading="Upplýsingar um staðgreiðslu maka"
            info={getDirectTaxPayments(spouseDirectPayments)}
            className={`contentUp delay-125`}
          >
            <TaxBreakdown items={spouseDirectPayments} />
          </CollapsibleProfileUnit>
        )}

        <CollapsibleProfileUnit
          heading="Umsóknarferli"
          info={applicantMoreInfo}
          className={`contentUp delay-125`}
        />

        <CollapsibleProfileUnit
          heading="Þjóðskrá"
          info={nationalRegistryInfo}
          className={`contentUp delay-125`}
        />

        {application.files && (
          <FilesListWithHeaderContainer applicationFiles={application.files} />
        )}

        <CommentSection
          className={`contentUp delay-125 ${styles.widthAlmostFull}`}
          setApplication={setApplication}
        />

        <History
          applicantName={application.name}
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
