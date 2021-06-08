import React, { useState, useContext, useMemo } from 'react'
import {
  Text,
  Divider,
  Box,
  Button,
  LoadingDots,
  Input,
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
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { useRouter } from 'next/router'

import * as styles from './summaryForm.treat'
import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import {
  Municipality,
  NavigationProps,
  getHomeCircumstances,
  HomeCircumstances,
  Employment,
  getEmploymentStatus,
  CreateApplication,
  insertAt,
  aidCalculator,
} from '@island.is/financial-aid/shared'

interface MunicipalityData {
  municipality: Municipality
}

const SummaryForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)
  const { user } = useContext(UserContext)

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
        },
      },
    })
    return data
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

  const calculation = [
    {
      label: 'Full upphæð aðstoðar',
      sum: '+ 200.000 kr.',
    },
    {
      label: 'Ofgreidd aðstoð í Feb 2021',
      sum: '- 10.000 kr.',
    },
    {
      label: 'Skattur',
      sum: '- 24.900 kr.',
    },
    {
      label: 'Persónuafsláttur',
      sum: '+ 32.900 kr.',
    },
  ]

  const overview = [
    {
      label: 'Heimili',
      // url: 'heimili',
      info: form?.customAddress
        ? form?.customHomeAddress + ', ' + form?.customPostalCode
        : 'Hafnargata 3, 220 Hafnarfjörður',
    },
    {
      label: 'Búseta',
      url: 'buseta',
      info:
        form?.homeCircumstances === 'Other'
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
        <Box display="flex" alignItems="center" marginBottom={1}>
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
            {calculation.map((item, index) => {
              return (
                <span key={'calculation-' + index}>
                  <Box
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="center"
                    padding={2}
                  >
                    <Text variant="small">{item.label}</Text>
                    <Text>{item.sum}</Text>
                  </Box>

                  <Divider />
                </span>
              )
            })}
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
                  ? aidAmount?.toLocaleString('de-DE') + ' kr.'
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
              <Text>
                {insertAt(user.nationalId.replace('-', ''), '-', 6) || '-'}
              </Text>
            )}
          </Box>

          <Box className={styles.contactInfo}>
            <Text fontWeight="semiBold">Sími</Text>
            {user?.phoneNumber && (
              <Text marginBottom={3}>
                {insertAt(user.phoneNumber.replace('-', ''), '-', 3) || '-'}
              </Text>
            )}

            <Text fontWeight="semiBold">Netfang</Text>
            <Text>{form?.emailAddress}</Text>
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
            <Text></Text>
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

        <Box marginBottom={[2, 2, 10]}>
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
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextButtonText="Senda umsókn"
        onNextButtonClick={() => {
          createApplication()
            .then((el) => {
              router.push(navigation?.nextUrl ?? '/')
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
        }}
      />
    </FormLayout>
  )
}

export default SummaryForm
