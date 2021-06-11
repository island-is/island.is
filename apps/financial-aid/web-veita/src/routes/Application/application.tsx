import React, { useEffect, useState, useContext, useReducer } from 'react'
import {
  LoadingDots,
  Text,
  Box,
  Button,
  Divider,
  ModalBase,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './application.treat'
import cn from 'classnames'

import { useQuery, useMutation } from '@apollo/client'
import {
  GetApplicantyQuery,
  UpdateApplicationMutation,
} from '../../../graphql/sharedGql'
import {
  Application,
  getHomeCircumstances,
  HomeCircumstances,
  getEmploymentStatus,
  Employment,
  insertAt,
  State,
  getState,
} from '@island.is/financial-aid/shared'
import format from 'date-fns/format'

import {
  calcDifferenceInDate,
  calcAge,
  navLinks,
  translateMonth,
} from '../../utils/formHelper'

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

interface SaveData {
  application: Application
}

const ApplicationProfile = () => {
  const router = useRouter()

  const [isVisible, setIsVisible] = useState(false)

  const [state, setState] = useState<string | undefined>(undefined)
  const [prevUrl, setPrevUrl] = useState<any | undefined>(undefined)

  const statusOptions = [
    State.NEW,
    State.INPROGRESS,
    State.APPROVED,
    State.REJECTED,
  ]

  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationMutation)

  const saveStateApplication = async (applicant: Application, state: State) => {
    if (saveLoading === false && applicant) {
      await updateApplicationMutation({
        variables: {
          input: {
            id: applicant.id,
            state: state,
          },
        },
      })
    }
    setIsVisible(false)
    setState(state)
  }

  const { data, error, loading } = useQuery<ApplicantData>(GetApplicantyQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (data?.application) {
      setState(data.application.state)
      //WIP
      setPrevUrl(navLinks('state', data.application.state))
    }
  }, [data?.application?.state])

  if (data?.application) {
    const applicationArr = [
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

    const filesTest = ['/lokaprof2021.docx', '/hengill_ultra_reglur_2021.pdf']

    const links = [
      {
        label: 'Ný mál',
        link: '/nymal',
        state: [State.NEW],
      },
      {
        label: 'Í vinnslu',
        link: '/vinnslu',
        state: [State.INPROGRESS],
      },
      {
        label: 'Afgreidd mál',
        link: '/afgreidd',
        state: [State.APPROVED, State.REJECTED],
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
            <Box marginBottom={3}>
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
                  setIsVisible(!isVisible)
                }}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="primary"
              >
                {getState[state as State]}
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
            info={applicationArr}
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
            <Files
              heading="Tekjugögn"
              filesArr={filesTest}
              className={styles.widtAlmostFull}
            />
          </>
        </Box>

        <ModalBase
          baseId="changeStatus"
          isVisible={isVisible}
          onVisibilityChange={(visibility) => {
            if (visibility !== isVisible) {
              setIsVisible(visibility)
            }
          }}
          className={styles.modalBase}
        >
          {/* //WIP take out error */}
          {({ closeModal }) => (
            <Box onClick={closeModal} className={styles.modalContainer}>
              <Box
                position="relative"
                background="white"
                borderRadius="large"
                className={styles.modal}
              >
                <Box
                  paddingLeft={4}
                  paddingY={2}
                  background="blue400"
                  className={styles.modalHeadline}
                >
                  <Text fontWeight="semiBold" color="white">
                    Stöðubreyting
                  </Text>
                </Box>
                <Box padding={4}>
                  {statusOptions.map((item, index) => {
                    return (
                      <button
                        key={'statusoptions-' + index}
                        className={cn({
                          [`${styles.statusOptions}`]: true,
                          [`${styles.activeState}`]: item === state,
                        })}
                        onClick={(e) => {
                          e.stopPropagation()
                          saveStateApplication(data.application, item)
                        }}
                      >
                        {getState[item as State]}
                      </button>
                    )
                  })}
                </Box>
              </Box>
            </Box>
          )}
        </ModalBase>
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
          Abbabab Notendi ekki fundinn, fara tilbaka og reyndu vinsamlegast
          aftur{' '}
        </Text>
      </AdminLayout>
    )
  }
}

export default ApplicationProfile
