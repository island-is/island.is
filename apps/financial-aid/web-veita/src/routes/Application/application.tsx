import React, { useEffect, useState, useMemo } from 'react'
import {
  LoadingDots,
  Text,
  Box,
  Divider,
  Button,
} from '@island.is/island-ui/core'
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
  getState,
  Municipality,
  aidCalculator,
  months,
  calculateAidFinalAmount,
  formatPhoneNumber,
  FileType,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

import {
  calcDifferenceInDate,
  calcAge,
  getTagByState,
} from '@island.is/financial-aid-web/veita/src/utils/formHelper'

import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

import {
  GeneratedProfile,
  GenerateName,
  Profile,
  AdminLayout,
  StateModal,
  AidAmountModal,
  History,
  CommentSection,
  FilesListWithHeader,
} from '@island.is/financial-aid-web/veita/src/components'

import { NavigationElement } from '@island.is/financial-aid-web/veita/src/routes/ApplicationsOverview/applicationsOverview'

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

  const [prevUrl, setPrevUrl] = useState<NavigationElement | undefined>()

  const findPrevUrl = (
    state: ApplicationState,
  ): React.SetStateAction<NavigationElement | undefined> => {
    return navigationItems.find((i) => i.applicationState.includes(state))
  }

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
        dataMunicipality?.municipality.settings.aid,
      )
    }
  }, [application, dataMunicipality])

  useEffect(() => {
    if (data?.application) {
      setApplication(data.application)

      setPrevUrl(findPrevUrl(data.application.state))
    }
  }, [data])

  const currentYear = format(new Date(), 'yyyy')

  if (application) {
    const applicationInfo = [
      {
        title: 'Tímabil',
        content:
          months[new Date(application.created).getMonth()] +
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
      <AdminLayout>
        <Box
          marginTop={10}
          marginBottom={15}
          className={`${styles.applicantWrapper}`}
        >
          <Box className={`contentUp   ${styles.widthAlmostFull} `}>
            <Box
              marginBottom={3}
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              width="full"
            >
              {prevUrl && (
                <Button
                  colorScheme="default"
                  iconType="filled"
                  onClick={() => {
                    router.push(prevUrl.link)
                  }}
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                >
                  Til baka
                </Button>
              )}

              {application.state && (
                <div className={`tags ${getTagByState(application.state)}`}>
                  {getState[application.state]}
                </div>
              )}
            </Box>

            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              width="full"
              paddingY={3}
            >
              <Box display="flex" alignItems="center">
                <Box marginRight={2}>
                  <GeneratedProfile
                    size={48}
                    nationalId={application.nationalId}
                  />
                </Box>

                <Text as="h2" variant="h1">
                  {GenerateName(application.nationalId)}
                </Text>
              </Box>

              <Button
                colorScheme="default"
                icon="pencil"
                iconType="filled"
                onClick={() => {
                  setStateModalVisible(!isStateModalVisible)
                }}
                preTextIconType="filled"
                size="small"
                type="button"
                variant="ghost"
              >
                Breyta stöðu
              </Button>
            </Box>

            <Divider />

            <Box display="flex" marginBottom={8} marginTop={4}>
              <Box marginRight={1}>
                <Text variant="small" fontWeight="semiBold" color="dark300">
                  Aldur umsóknar
                </Text>
              </Box>
              <Text variant="small">
                {calcDifferenceInDate(application.created)}
              </Text>
            </Box>
          </Box>

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
          <>
            <Box
              marginBottom={[2, 2, 3]}
              className={`contentUp delay-125 ${styles.widthAlmostFull}`}
            >
              <Text as="h2" variant="h3" color="dark300">
                Gögn frá umsækjanda
              </Text>
            </Box>
            <FilesListWithHeader
              heading="Skattframtal"
              files={application.files?.filter(
                (f) => f.type === FileType.TAXRETURN,
              )}
            />
            <FilesListWithHeader
              heading="Tekjugögn"
              files={application.files?.filter(
                (f) => f.type === FileType.INCOME,
              )}
            />
            <FilesListWithHeader
              heading="Innsend gögn"
              files={application.files?.filter(
                (f) => f.type === FileType.OTHER,
              )}
            />
          </>

          <CommentSection
            className={`contentUp delay-125 ${styles.widthAlmostFull}`}
          />

          <History />
        </Box>

        {application.state && (
          <StateModal
            isVisible={isStateModalVisible}
            onVisiblityChange={(isVisibleBoolean) => {
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
      </AdminLayout>
    )
  }
  if (loading) {
    return (
      <AdminLayout>
        <LoadingDots />
      </AdminLayout>
    )
  }
  return (
    <AdminLayout>
      <Box>
        <Button
          colorScheme="default"
          iconType="filled"
          onClick={() => {
            router.push('/')
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
    </AdminLayout>
  )
}

export default ApplicationProfile
