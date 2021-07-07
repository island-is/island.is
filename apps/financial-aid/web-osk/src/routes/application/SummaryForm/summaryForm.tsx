import React, { useState, useContext, useMemo } from 'react'
import {
  Text,
  Divider,
  Box,
  Button,
  LoadingDots,
  Input,
  Icon,
} from '@island.is/island-ui/core'

import { useMutation, useQuery } from '@apollo/client'

import {
  GetMunicipalityQuery,
  CreateApplicationQuery,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  CancelModal,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { useRouter } from 'next/router'

import * as styles from './summaryForm.treat'
import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import format from 'date-fns/format'

import {
  calculateAidFinalAmount,
  calulateTaxOfAmount,
  calulatePersonalTaxAllowanceUsed,
  TaxInfo,
} from '@island.is/financial-aid-web/osk/src/utils/taxCalculator'

import {
  Municipality,
  NavigationProps,
  getHomeCircumstances,
  HomeCircumstances,
  Employment,
  getEmploymentStatus,
  formatPhoneNumber,
  formatNationalId,
  aidCalculator,
  ApplicationState,
} from '@island.is/financial-aid/shared'

interface MunicipalityData {
  municipality: Municipality
}

const SummaryForm = () => {
  const currentYear = format(new Date(), 'yyyy')

  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)
  console.log(form)

  const { user } = useContext(UserContext)

  const [isVisible, setIsVisible] = useState(false)

  const { data, error, loading } = useQuery<MunicipalityData>(
    GetMunicipalityQuery,
    {
      variables: { input: { id: 'hfj' } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const [formError, setFormError] = useState({
    status: false,
    message: '',
  })

  const [creatApplicationMutation, { loading: isUpdating }] = useMutation(
    CreateApplicationQuery,
  )

  const createApplication = async () => {
    const { data } = await creatApplicationMutation({
      variables: {
        input: {
          nationalId: user?.nationalId,
          name: user?.name,
          phoneNumber: user?.phoneNumber,
          email: form?.emailAddress,
          homeCircumstances: form?.homeCircumstances,
          homeCircumstancesCustom: form?.homeCircumstancesCustom,
          student: Boolean(form?.student),
          studentCustom: form?.studentCustom,
          hasIncome: Boolean(form?.hasIncome),
          usePersonalTaxCredit: Boolean(form?.usePersonalTaxCredit),
          bankNumber: form?.bankNumber,
          ledger: form?.ledger,
          accountNumber: form?.accountNumber,
          interview: Boolean(form?.interview),
          employment: form?.employment,
          employmentCustom: form?.employmentCustom,
          formComment: form?.formComment,
          state: ApplicationState.NEW,
        },
      },
    })
    return data
  }

  const errorCheck = () => {
    createApplication()
      .then(() => {
        if (navigation?.nextUrl) {
          router.push(navigation?.nextUrl)
        }

        router.events.on('routeChangeComplete', (url) => {
          //Clear session storage
          updateForm({ submitted: false, incomeFiles: [] })
        })
      })
      .catch((err) =>
        setFormError({
          status: true,
          message: 'Obobb einhvað fór úrskeiðis',
        }),
      )
  }

  const aidAmount = useMemo(() => {
    if (form && data && form.homeCircumstances) {
      return aidCalculator(
        form.homeCircumstances,
        data?.municipality.settings.aid,
      )
    }
  }, [form, data])

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const overview = [
    {
      label: 'Búseta',
      url: 'buseta',
      info:
        form?.homeCircumstances === HomeCircumstances.OTHER
          ? form?.homeCircumstancesCustom
          : getHomeCircumstances[form?.homeCircumstances as HomeCircumstances],
    },
    {
      label: 'Tekjur',
      url: 'tekjur',
      info:
        'Ég hef ' +
        (form?.incomeFiles ? '' : 'ekki') +
        'fengið tekjur í þessum mánuði eða síðasta',
    },
    {
      label: 'Staða',
      url: 'atvinna',
      info: form?.employmentCustom
        ? form?.employmentCustom
        : getEmploymentStatus[form?.employment as Employment],
    },
    {
      label: 'Netfang',
      url: 'samskipti',
      info: form?.emailAddress,
    },
  ]

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Yfirlit umsóknar
        </Text>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          marginBottom={1}
        >
          <Box marginRight={1}>
            <Text as="h2" variant="h3" marginBottom={1}>
              Áætluð aðstoð
            </Text>
          </Box>

          <Text variant="small">(til útgreiðslu í byrjun júní)</Text>
        </Box>

        <Text marginBottom={[2, 2, 3]}>
          Athugaðu að þessi útreikningur er eingöngu til viðmiðunar og{' '}
          <span className={styles.taxReturn}>
            gerir ekki ráð fyrir tekjum eða gögnum úr skattframtali
          </span>{' '}
          sem geta haft áhrif á þína aðstoð. Þú færð skilaboð þegar frekari
          útreikningur liggur fyrir.
        </Text>
        {data && (
          <>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              padding={2}
            >
              <Text variant="small">Full upphæð aðstoðar </Text>
              <Text>{aidAmount?.toLocaleString('de-DE')} kr.</Text>
            </Box>

            <Divider />

            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              padding={2}
            >
              <Text variant="small">Skattur</Text>
              <Text>
                -{' '}
                {aidAmount &&
                  calulateTaxOfAmount(aidAmount, currentYear).toLocaleString(
                    'de-DE',
                  )}{' '}
                kr.
              </Text>
            </Box>

            <Divider />

            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              padding={2}
            >
              <Text variant="small">Persónuafsláttur</Text>
              <Text>
                +{' '}
                {aidAmount &&
                  calulatePersonalTaxAllowanceUsed(
                    aidAmount,
                    Boolean(form?.usePersonalTaxCredit),
                    currentYear,
                  ).toLocaleString('de-DE')}{' '}
                kr.
              </Text>
            </Box>

            <Divider />

            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              padding={2}
              background="blue100"
            >
              <Text variant="small">Áætluð aðstoð (hámark)</Text>
              <Text>
                {aidAmount !== undefined
                  ? calculateAidFinalAmount(
                      aidAmount,
                      Boolean(form?.usePersonalTaxCredit),
                      currentYear,
                    ).toLocaleString('de-DE') + ' kr.'
                  : 'Abbabb.. mistókst að reikna'}
              </Text>
            </Box>
            <Divider />
          </>
        )}
        {loading && (
          <Box marginBottom={[4, 4, 5]} display="flex" justifyContent="center">
            <LoadingDots large />
          </Box>
        )}
        <Box marginTop={[4, 4, 5]}>
          <Divider />
        </Box>

        <Box
          display="flex"
          alignItems="flexStart"
          paddingY={[4, 4, 5]}
          className={cn({
            [`${styles.userInfoContainer}`]: true,
          })}
        >
          <Box className={styles.mainInfo}>
            <Text fontWeight="semiBold">Nafn</Text>
            <Text marginBottom={3}>{user?.name}</Text>

            <Text fontWeight="semiBold">Kennitala</Text>
            {user?.nationalId && (
              <Text>{formatNationalId(user.nationalId)}</Text>
            )}
          </Box>

          <Box className={styles.contactInfo}>
            <Text fontWeight="semiBold">Sími</Text>
            {user?.phoneNumber && (
              <Text marginBottom={3}>
                {formatPhoneNumber(user.phoneNumber)}
              </Text>
            )}

            <Text fontWeight="semiBold">Heimili</Text>
            <Text>Hafnargata 3, 220 Hafnarfjörður</Text>
          </Box>
        </Box>
        {overview.map((item, index) => {
          return (
            <span key={'overview-' + index}>
              <Divider />

              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexStart"
                paddingY={[4, 4, 5]}
              >
                <Box marginRight={3}>
                  <Text fontWeight="semiBold">{item.label}</Text>
                  <Text>{item.info}</Text>
                </Box>

                {item.url && (
                  <Button
                    icon="pencil"
                    iconType="filled"
                    variant="utility"
                    onClick={() => {
                      router.push(item.url)
                    }}
                  >
                    Breyta
                  </Button>
                )}
              </Box>
            </span>
          )
        })}
        <Divider />

        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="flexStart"
          paddingY={[4, 4, 5]}
          marginBottom={[2, 2, 5]}
        >
          <Box marginRight={3}>
            <Text fontWeight="semiBold">Gögn</Text>
            <Box>
              {form?.incomeFiles && (
                <>
                  {form.incomeFiles.map((file, index) => {
                    return (
                      <a
                        // href={file.name}
                        key={`file-` + index}
                        className={styles.filesButtons}
                        target="_blank"
                        download
                      >
                        <Box marginRight={1} display="flex" alignItems="center">
                          <Icon
                            color="blue400"
                            icon="document"
                            size="small"
                            type="outline"
                          />
                        </Box>

                        <Text>{file.name}</Text>
                      </a>
                    )
                  })}
                </>
              )}

              {form?.taxReturnFiles && (
                <>
                  {form.taxReturnFiles.map((file, index) => {
                    return (
                      <a
                        // href={file.name}
                        key={`file-` + index}
                        className={styles.filesButtons}
                        target="_blank"
                        download
                      >
                        <Box marginRight={1} display="flex" alignItems="center">
                          <Icon
                            color="blue400"
                            icon="document"
                            size="small"
                            type="outline"
                          />
                        </Box>

                        <Text>{file.name}</Text>
                      </a>
                    )
                  })}
                </>
              )}
            </Box>
          </Box>

          <Button
            icon="pencil"
            iconType="filled"
            variant="utility"
            onClick={() => {
              router.push('gogn')
            }}
          >
            Breyta
          </Button>
        </Box>

        <Box marginBottom={[3, 3, 4]}>
          <Text variant="h3">Annað sem þú vilt koma á framfæri?</Text>
        </Box>

        <Box marginBottom={[4, 4, 10]}>
          <Input
            backgroundColor={'blue'}
            label="Athugasemd"
            name="formComment"
            placeholder="Skrifaðu hér"
            rows={8}
            textarea
            value={form?.formComment}
            onChange={(event) => {
              updateForm({ ...form, formComment: event.target.value })
            }}
          />
        </Box>

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: formError.status,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            {formError.message}
          </Text>
        </div>

        <CancelModal
          isVisible={isVisible}
          setIsVisible={(isVisibleBoolean) => {
            setIsVisible(isVisibleBoolean)
          }}
        />
      </FormContentContainer>

      <FormFooter
        onPrevButtonClick={() => {
          setIsVisible(!isVisible)
        }}
        previousIsDestructive={true}
        nextButtonText="Senda umsókn"
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default SummaryForm
