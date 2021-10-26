import React, { useEffect, useState, useMemo, useContext } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './application.css'

import { useQuery } from '@apollo/client'
import { ApplicationQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import {
  Application,
  ApplicationState,
  aidCalculator,
  getMonth,
  calculateAidFinalAmount,
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
  ApplicationSkeleton,
  LoadingContainer,
  ApplicationNotFound,
} from '@island.is/financial-aid-web/veita/src/components'
import { AdminContext } from '../../components/AdminProvider/AdminProvider'
import {
  getApplicant,
  getApplicantMoreInfo,
} from '../../utils/applicationHelper'

interface ApplicantData {
  application: Application
}

const ApplicationProfile = () => {
  const router = useRouter()

  const [isStateModalVisible, setStateModalVisible] = useState(false)

  const [isAidModalVisible, setAidModalVisible] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const { municipality } = useContext(AdminContext)

  const { data, loading } = useQuery<ApplicantData>(ApplicationQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const [application, setApplication] = useState<Application>()

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

  useEffect(() => {
    if (data?.application) {
      setApplication(data.application)
    }
  }, [data])

  const currentYear = format(new Date(), 'yyyy')

  if (application) {
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

    const applicantMoreInfo = getApplicantMoreInfo(application)

    return (
      <LoadingContainer isLoading={isLoading} loader={<ApplicationSkeleton />}>
        <Box
          marginTop={10}
          marginBottom={15}
          className={`${styles.applicantWrapper}`}
        >
          <ApplicationHeader
            application={application}
            onClickApplicationState={() => {
              setStateModalVisible(
                (isStateModalVisible) => !isStateModalVisible,
              )
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
          <Profile
            heading="Aðrar upplýsingar"
            info={applicantMoreInfo}
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
      </LoadingContainer>
    )
  }

  return <ApplicationNotFound loading={loading} />
}

export default ApplicationProfile
