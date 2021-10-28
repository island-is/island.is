import React, { useState, useMemo, useContext } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'

import * as styles from './ApplicationProfile.css'

import {
  Application,
  ApplicationState,
  aidCalculator,
  getMonth,
  calculateAidFinalAmount,
  showSpouseData,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

import {
  Profile,
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
  getNationalRegistryInfo,
} from '@island.is/financial-aid-web/veita/src/utils/applicationHelper'

interface ApplicationProps {
  application: Application
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ApplicationProfile = ({
  application,
  setApplication,
  setIsLoading,
}: ApplicationProps) => {
  const [isStateModalVisible, setStateModalVisible] = useState(false)

  const [isAidModalVisible, setAidModalVisible] = useState(false)

  const { municipality } = useContext(AdminContext)

  const aidAmount = useMemo(() => {
    if (application && municipality && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        application.spouseNationalId
          ? municipality.cohabitationAid
          : municipality.individualAid,
      )
    }
  }, [application, municipality])

  const currentYear = format(new Date(), 'yyyy')

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
    {
      title: 'Sótt um',
      content: `${
        aidAmount &&
        calculateAidFinalAmount(
          aidAmount,
          application.usePersonalTaxCredit,
          currentYear,
        ).toLocaleString('de-DE')
      } kr.`,
      onclick: () => {
        setAidModalVisible(!isAidModalVisible)
      },
    },
  ]

  if (application.state === ApplicationState.APPROVED) {
    applicationInfo.push({
      title: 'Veitt',
      content: `${application.amount?.toLocaleString('de-DE')} kr.`,
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

  return (
    <>
      <Box
        marginTop={10}
        marginBottom={15}
        className={`${styles.applicantWrapper}`}
      >
        <ApplicationHeader
          application={application}
          onClickApplicationState={() => {
            setStateModalVisible((isStateModalVisible) => !isStateModalVisible)
          }}
          setApplication={setApplication}
          setIsLoading={setIsLoading}
        />

        <Profile
          heading="Umsókn"
          info={applicationInfo}
          className={`contentUp delay-50`}
        />

        <Profile
          heading="Umsækjandi"
          info={applicant}
          className={`contentUp delay-75`}
        />

        {showSpouseData[application.familyStatus] && (
          <Profile
            heading="Maki"
            info={applicantSpouse}
            className={`contentUp delay-75`}
          />
        )}

        <Profile
          heading="Umsóknarferli"
          info={applicantMoreInfo}
          className={`contentUp delay-100`}
        />

        <Profile
          heading="Þjóðskrá"
          info={nationalRegistryInfo}
          className={`contentUp delay-100`}
        />

        <FilesListWithHeaderContainer applicationFiles={application.files} />

        <CommentSection
          className={`contentUp delay-125 ${styles.widthAlmostFull}`}
          setApplication={setApplication}
        />

        <History
          applicantName={application.name}
          applicationEvents={application.applicationEvents}
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
          setIsLoading={setIsLoading}
        />
      )}

      {aidAmount && (
        <AidAmountModal
          aidAmount={aidAmount}
          usePersonalTaxCredit={application.usePersonalTaxCredit}
          isVisible={isAidModalVisible}
          onVisibilityChange={(isVisibleBoolean) => {
            setAidModalVisible(isVisibleBoolean)
          }}
        />
      )}
    </>
  )
}

export default ApplicationProfile
