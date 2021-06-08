import React, { useEffect, useState, useContext, useReducer } from 'react'
import {
  LoadingDots,
  Text,
  Box,
  Button,
  Divider,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './application.treat'
import cn from 'classnames'

import { useQuery } from '@apollo/client'
import { GetApplicantyQuery } from '../../../graphql/sharedGql'
import {
  Application,
  getHomeCircumstances,
  HomeCircumstances,
  getEmploymentStatus,
  Employment,
  insertAt,
} from '@island.is/financial-aid/shared'
import format from 'date-fns/format'

import { calcDifferenceInDate, calcAge } from '../../utils/formHelper'

import {
  GeneratedProfile,
  GenerateName,
  Profile,
  Files,
  AdminLayout,
} from '../../components'

interface ApplicantData {
  application: Application
}

const ApplicationProfile = () => {
  const router = useRouter()

  const { data, error, loading } = useQuery<ApplicantData>(GetApplicantyQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  if (data?.application) {
    const applicationArr = [
      {
        title: 'Tímabil',
        content: format(new Date(data.application.created), 'MM y'),
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
    ]

    const filesTest = ['/lokaprof2021.docx', '/hengill_ultra_reglur_2021.pdf']

    return (
      <AdminLayout>
        <Box marginY={10} className={styles.applicantWrapper}>
          <Box className={styles.widthFull}>
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

          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            width="full"
            paddingY={3}
            className={styles.widtAlmostFull}
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
              onClick={function noRefCheck() {}}
              preTextIconType="filled"
              size="default"
              type="button"
              size="small"
              variant="primary"
            >
              Ný umsókn
            </Button>
          </Box>
          <Box width="full" marginBottom={4} className={styles.widtAlmostFull}>
            <Divider />
          </Box>
          <Box display="flex" marginBottom={8} className={styles.widthFull}>
            <Box marginRight={1}>
              <Text variant="small" fontWeight="semiBold" color="dark300">
                Aldur umsóknar
              </Text>
            </Box>
            <Text variant="small">
              {calcDifferenceInDate(data.application.created)}
            </Text>
          </Box>

          <Profile heading="Umsókn" info={applicationArr} />
          <Profile heading="Umsækjandi" info={applicant} />
          <Profile heading="Aðrar upplýsingar" info={applicantMoreInfo} />
          <>
            <Box marginBottom={[2, 2, 3]} className={styles.widtAlmostFull}>
              <Text as="h2" variant="h3" color="dark300">
                Gögn frá umsækjanda
              </Text>
            </Box>
            <Files
              heading="Tekjugögn"
              filesArr={filesTest}
              className={styles.widtAlmostFull}
            />
          </>
        </Box>
      </AdminLayout>
    )
  }
  if (loading) {
    return <LoadingDots />
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
          Abbabab Notendi ekki fundinn, fara tilbaka og reyndu vinsamlegast
          aftur{' '}
        </Text>
      </AdminLayout>
    )
  }
}

export default ApplicationProfile
