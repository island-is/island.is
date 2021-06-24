import React, { useEffect, useState } from 'react'
import {
  LoadingDots,
  Text,
  Box,
  Button,
  Divider,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './application.treat'

import { useQuery } from '@apollo/client'
import { GetApplicationQuery } from '../../../graphql/sharedGql'

import {
  Application,
  getHomeCircumstances,
  HomeCircumstances,
  getEmploymentStatus,
  Employment,
  insertAt,
  ApplicationState,
  getState,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'

import {
  calcDifferenceInDate,
  calcAge,
  navigationElements,
  translateMonth,
  getTagByState,
} from '../../utils/formHelper'

import {
  GeneratedProfile,
  GenerateName,
  Profile,
  Files,
  AdminLayout,
  StateModal,
} from '../../components'

interface ApplicantData {
  application: Application
}

const ApplicationProfile = () => {
  const router = useRouter()

  const [isModalVisible, setModalVisible] = useState(false)

  const [prevUrl, setPrevUrl] = useState<any | undefined>(undefined)

  const { data, error, loading } = useQuery<ApplicantData>(
    GetApplicationQuery,
    {
      variables: { input: { id: router.query.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const [applicationState, setApplicationState] = useState<
    ApplicationState | undefined
  >(data?.application?.state)

  useEffect(() => {
    if (data?.application) {
      setApplicationState(data.application.state)
      //WIP
      setPrevUrl(
        navigationElements.find((i) =>
          i.applicationState.includes(data.application.state),
        ),
      )
    }
  }, [data?.application?.state])

  if (data?.application) {
    const applicationInfo = [
      {
        title: 'Tímabil',
        content:
          translateMonth(format(new Date(data.application.created), 'M')) +
          format(new Date(data.application.created), ' y'),
      },
      {
        title: 'Sótt um',
        content: format(new Date(data.application.created), 'dd.MM.y  · kk:mm'),
      },
      {
        title: 'Sótt um',
        content: '198.900 kr.',
      },
    ]

    const applicant = [
      {
        title: 'Nafn',
        content: data?.application.name,
      },
      {
        title: 'Aldur',
        content: calcAge(data.application.nationalId) + ' ára',
      },
      {
        title: 'Kennitala',
        content:
          insertAt(data.application.nationalId.replace('-', ''), '-', 6) || '-',
      },
      {
        title: 'Netfang',
        content: data?.application.email,
        link: 'mailto:' + data?.application.email,
      },
      {
        title: 'Sími',
        content:
          insertAt(data.application.phoneNumber.replace('-', ''), '-', 3) ||
          '-',
        link: 'tel:' + data.application.phoneNumber,
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
        title: 'Fjöldi barna',
        content: '??',
      },
      {
        title: 'Búsetuform',
        content:
          getHomeCircumstances[
            data.application.homeCircumstances as HomeCircumstances
          ],
        other: data.application.homeCircumstancesCustom,
      },
      {
        title: 'Atvinna',
        content: getEmploymentStatus[data.application.employment as Employment],
        other: data.application.employmentCustom,
      },
      {
        title: 'Lánshæft nám',
        content: data.application.student ? 'Já' : 'Nei',
        other: data.application.studentCustom,
      },
      {
        title: 'Hefur haft tekjur',
        content: data.application.hasIncome ? 'Já' : 'Nei',
      },
      {
        title: 'Athugasemd',
        other: data.application.formComment,
      },
    ]

    return (
      <AdminLayout>
        <Box
          marginTop={10}
          marginBottom={15}
          className={`${styles.applicantWrapper}`}
        >
          <Box className={`contentUp   ${styles.widtAlmostFull} `}>
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
                  {prevUrl?.label}
                </Button>
              )}

              <div className={`tags ${getTagByState(data.application.state)}`}>
                {getState[data.application.state]}
              </div>
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
                  <GeneratedProfile size={48} />
                </Box>

                <Text as="h2" variant="h1">
                  {GenerateName(data.application.nationalId)}
                </Text>
              </Box>

              <Button
                colorScheme="default"
                icon="pencil"
                iconType="filled"
                onClick={() => {
                  setModalVisible(!isModalVisible)
                }}
                preTextIconType="filled"
                size="default"
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
                {calcDifferenceInDate(data.application.created)}
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
            <Box marginBottom={[2, 2, 3]} className={styles.widtAlmostFull}>
              <Text as="h2" variant="h3" color="dark300">
                Gögn frá umsækjanda
              </Text>
            </Box>
            <Files heading="Skattframtal" className={styles.widtAlmostFull} />
            <Files heading="Tekjugögn" className={styles.widtAlmostFull} />
          </>
        </Box>

        {applicationState && (
          <StateModal
            isVisible={isModalVisible}
            setIsVisible={(isVisibleBoolean) => {
              setModalVisible(isVisibleBoolean)
            }}
            setApplicationState={(applicationState: ApplicationState) => {
              setApplicationState(applicationState)
            }}
            application={data.application}
            applicationState={applicationState}
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
  } else {
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
          Abbabab Notendi ekki fundinn, farðu tilbaka og reyndu vinsamlegast
          aftur{' '}
        </Text>
      </AdminLayout>
    )
  }
}

export default ApplicationProfile
