import React, { useEffect, useState, useContext, useMemo } from 'react'
import {
  Text,
  Divider,
  Box,
  Button,
  AccordionCard,
  ContentBlock,
  LoadingIcon,
} from '@island.is/island-ui/core'

import { useQuery } from '@apollo/client'

import {
  GetMunicipalityQuery,
  GetApplicationQuery,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
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
} from '@island.is/financial-aid/types'

interface MunicipalityData {
  municipality: Municipality
}

const SummaryForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const { data, error, loading } = useQuery<MunicipalityData>(
    GetMunicipalityQuery,
    {
      variables: { input: { id: 'hfj' } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const aidCalculator = (
    homeCircumstances: HomeCircumstances,
    aid: {
      ownApartmentOrLease: number
      withOthersOrUnknow: number
      withParents: number
    },
  ): number => {
    switch (homeCircumstances) {
      case 'OwnPlace':
        return aid.ownApartmentOrLease
      case 'RegisteredLease':
        return aid.ownApartmentOrLease
      case 'WithOthers':
        return aid.withOthersOrUnknow
      case 'Other':
      case 'Unknown':
        return aid.withOthersOrUnknow
      case 'WithParents':
        return aid.withParents
      default:
        return aid.withParents
    }
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
      url: 'heimili',
      info: form?.customAddress
        ? form?.customHomeAddress + ', ' + form?.customPostalCode
        : 'Hafnargata 3, 220 Hafnarfjörður',
    },
    {
      label: 'Búseta',
      url: 'buseta',
      info: form?.homeCircumstancesCustom
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
        <Text as="h1" variant="h2" marginBottom={2}>
          Yfirlit umsóknar
        </Text>
        <Text marginBottom={[3, 3, 5]}>
          <strong>Við eigum enn eftir að klára gagnaöflun</strong> en samkvæmt
          því sem við vitum um þig í dag getur þú miðað við:
        </Text>
        {data && (
          <ContentBlock>
            <Box marginBottom={[4, 4, 5]}>
              <AccordionCard id="id_1" label="Bráðabirgðaútreikningur">
                {calculation.map((item, index) => {
                  return (
                    <>
                      <Box
                        display="flex"
                        justifyContent="spaceBetween"
                        alignItems="center"
                        paddingTop={2}
                        paddingBottom={2}
                      >
                        <Text variant="small">{item.label}</Text>
                        <Text fontWeight="semiBold">{item.sum}</Text>
                      </Box>

                      <Divider />
                    </>
                  )
                })}

                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  paddingTop={2}
                >
                  <Text variant="small" fontWeight="semiBold">
                    Áætluð aðstoð (hámark)
                  </Text>
                  <Text fontWeight="semiBold">
                    {aidAmount !== undefined
                      ? aidAmount?.toLocaleString('de-DE') + ' kr.'
                      : 'Abbabb.. mistókst að reikna'}
                  </Text>
                </Box>
              </AccordionCard>
            </Box>
          </ContentBlock>
        )}

        {loading && (
          <Box marginBottom={[4, 4, 5]} display="flex" justifyContent="center">
            <LoadingIcon animate size={50} />
          </Box>
        )}

        <Divider />
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
            <Text marginBottom={3}>Nafn Nafnsson</Text>

            <Text fontWeight="semiBold">Kennitala</Text>
            <Text>190379-5829</Text>
          </Box>

          <Box className={styles.contactInfo}>
            <Text fontWeight="semiBold">Sími</Text>
            <Text marginBottom={3}>697-3345</Text>

            <Text fontWeight="semiBold">Netfang</Text>
            <Text>{form?.emailAddress}</Text>
          </Box>
        </Box>
        {overview.map((item, index) => {
          return (
            <>
              <Divider />

              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexStart"
                paddingY={[4, 4, 5]}
                className={cn({
                  [`${styles.marginBottom}`]: index === overview.length - 1,
                })}
              >
                <Box marginRight={3}>
                  <Text fontWeight="semiBold">{item.label}</Text>
                  <Text>{item.info}</Text>
                </Box>

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
              </Box>
            </>
          )
        })}
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextUrl={navigation?.nextUrl ?? '/'}
      />
    </FormLayout>
  )
}

export default SummaryForm
