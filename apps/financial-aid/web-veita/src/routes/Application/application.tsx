import React, { useEffect, useState, useMemo } from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './application.treat'

import { useQuery } from '@apollo/client'
import {
  GetApplicationQuery,
  GetMunicipalityQuery,
} from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import {
  Application,
  getHomeCircumstances,
  HomeCircumstances,
  getEmploymentStatus,
  Employment,
  insertAt,
  ApplicationState,
  Municipality,
  aidCalculator,
  getMonth,
  calculateAidFinalAmount,
  formatPhoneNumber,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

import { calcAge } from '@island.is/financial-aid-web/veita/src/utils/formHelper'

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
} from '@island.is/financial-aid-web/veita/src/components'

interface ApplicantData {
  application: Application
}

interface MunicipalityData {
  municipality: Municipality
}

const ApplicationProfile = () => {
  const router = useRouter()

  const [isStateModalVisible, setStateModalVisible] = useState(false)

  const [isAidModalVisible, setAidModalVisible] = useState(false)

  const { data, loading } = useQuery<ApplicantData>(GetApplicationQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const { data: dataMunicipality } = useQuery<MunicipalityData>(
    GetMunicipalityQuery,
    {
      variables: { input: { id: 'hfj' } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const [application, setApplication] = useState<Application>()

  const aidAmount = useMemo(() => {
    if (application && dataMunicipality && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        dataMunicipality?.municipality.aid,
      )
    }
  }, [application, dataMunicipality])

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

    const applicant = [
      {
        title: 'Nafn',
        content: data?.application.name,
      },
      {
        title: 'Aldur',
        content: calcAge(application.nationalId) + ' ára',
      },
      {
        title: 'Kennitala',
        content:
          insertAt(application.nationalId.replace('-', ''), '-', 6) || '-',
      },
      {
        title: 'Netfang',
        content: data?.application.email,
        link: 'mailto:' + data?.application.email,
      },
      {
        title: 'Sími',
        content: formatPhoneNumber(application.phoneNumber),
        link: 'tel:' + application.phoneNumber,
      },
      {
        title: 'Bankareikningur',
        content:
          data?.application.bankNumber +
          '-' +
          data?.application.ledger +
          '-' +
          data?.application.accountNumber,
      },
      {
        title: 'Nota persónuafslátt',
        content: data?.application.usePersonalTaxCredit ? 'Já' : 'Nei',
      },
      {
        title: 'Ríkisfang',
        content: 'Ísland',
      },
    ]

    const applicantMoreInfo = [
      {
        title: 'Lögheimili',
        content: 'Hafnarstræti 10',
      },
      {
        title: 'Póstnúmer',
        content: '220',
      },
      {
        title: 'Maki',
        content: '??',
      },
      {
        title: 'Búsetuform',
        content:
          getHomeCircumstances[
            application.homeCircumstances as HomeCircumstances
          ],
        other: application.homeCircumstancesCustom,
      },
      {
        title: 'Atvinna',
        content: getEmploymentStatus[application.employment as Employment],
        other: application.employmentCustom,
      },
      {
        title: 'Lánshæft nám',
        content: application.student ? 'Já' : 'Nei',
        other: application.studentCustom,
      },
      {
        title: 'Hefur haft tekjur',
        content: application.hasIncome ? 'Já' : 'Nei',
      },
      {
        title: 'Athugasemd',
        other: application.formComment,
      },
    ]

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
              setStateModalVisible(
                (isStateModalVisible) => !isStateModalVisible,
              )
            }}
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
            onStateChange={(applicationState: ApplicationState) => {
              setApplication({
                ...application,
                state: applicationState,
              })
            }}
            application={application}
          />
        )}

        {aidAmount && (
          <AidAmountModal
            aidAmount={aidAmount}
            usePersonalTaxCredit={application.usePersonalTaxCredit}
            isVisible={isAidModalVisible}
            onVisiblityChange={(isVisibleBoolean) => {
              setAidModalVisible(isVisibleBoolean)
            }}
          />
        )}
      </>
    )
  }

  return (
    <LoadingContainer isLoading={loading} loader={<ApplicationSkeleton />}>
      <Box>
        <Button
          colorScheme="default"
          iconType="filled"
          onClick={() => {
            router.push('/nymal')
          }}
          preTextIcon="arrowBack"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="text"
        >
          Í vinnslu
        </Button>
      </Box>
      <Text color="red400" fontWeight="semiBold" marginTop={4}>
        Abbabab Notendi ekki fundinn, farðu tilbaka og reyndu vinsamlegast aftur{' '}
      </Text>
    </LoadingContainer>
  )
}

export default ApplicationProfile
