import React, { useState, useContext } from 'react'
import { Text, Divider, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  CancelModal,
  Estimation,
  UserInfo,
  AllFiles,
  FormInfo,
  FormComment,
  ContactInfo,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './summaryForm.css'
import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import {
  Employment,
  FamilyStatus,
  getEmploymentStatus,
  getFamilyStatus,
  getHomeCircumstances,
  HomeCircumstances,
  NavigationProps,
  Routes,
} from '@island.is/financial-aid/shared/lib'

import useApplication from '@island.is/financial-aid-web/osk/src/utils/hooks/useApplication'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const SummaryForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const { user } = useContext(AppContext)

  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formError, setFormError] = useState({
    status: false,
    message: '',
  })

  const { createApplication } = useApplication()

  const formInfoOverview = [
    {
      id: 'familyStatus',
      label: 'Hjúskaparstaða',
      url: Routes.form.relationship,
      info: getFamilyStatus[form.familyStatus as FamilyStatus],
    },
    {
      id: 'homeCircumstances',
      label: 'Búseta',
      url: Routes.form.homeCircumstances,
      info:
        form?.homeCircumstances === HomeCircumstances.OTHER
          ? form?.homeCircumstancesCustom
          : getHomeCircumstances[form.homeCircumstances as HomeCircumstances],
    },
    {
      id: 'hasIncome',
      label: 'Tekjur',
      url: Routes.form.hasIncome,
      info:
        form?.hasIncome === undefined
          ? undefined
          : 'Ég hef ' +
            (form.hasIncome ? 'ekki ' : '') +
            'fengið tekjur í þessum mánuði eða síðasta',
    },
    {
      id: 'employmentCustom',
      label: 'Staða',
      url: Routes.form.employment,
      info: form?.employmentCustom
        ? form.employmentCustom
        : getEmploymentStatus[form.employment as Employment],
    },
    {
      id: 'usePersonalTaxCredit',
      label: 'Nýta persónuafslátt?',
      url: Routes.form.usePersonalTaxCredit,
      info: form?.usePersonalTaxCredit ? 'Já' : 'Nei',
    },
    {
      id: 'bankInfo',
      label: 'Bankaupplýsingar',
      url: Routes.form.bankInfo,
      info:
        form.bankNumber && form.ledger && form.accountNumber
          ? form.bankNumber + '-' + form.ledger + '-' + form.accountNumber
          : '',
    },
  ]

  const handleNextButtonClick = async () => {
    if (!form || !user) {
      return
    }
    setIsLoading(true)
    await createApplication(form, user, updateForm)
      .then(() => {
        setIsLoading(false)
        if (navigation?.nextUrl) {
          router.push(navigation.nextUrl)
        }
      })
      .catch((e) => {
        setIsLoading(false)
        setFormError({
          status: true,
          message: 'Obbobbob einhvað fór úrskeiðis',
        })

        const findErrorInFormInfo = formInfoOverview.find(
          (el) => el.info === undefined,
        )

        if (findErrorInFormInfo) {
          var element = document.getElementById(findErrorInFormInfo.id)
          element?.scrollIntoView({
            behavior: 'smooth',
          })
        }

        if (form.emailAddress === undefined || form.phoneNumber === undefined) {
          var element = document.getElementById('contactInfo')
          element?.scrollIntoView({
            behavior: 'smooth',
          })
        }
      })
  }

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Yfirlit umsóknar
        </Text>
        {form.homeCircumstances && (
          <>
            <Estimation
              usePersonalTaxCredit={form.usePersonalTaxCredit}
              homeCircumstances={form.homeCircumstances}
              aboutText={
                <Text marginBottom={[2, 2, 3]}>
                  Athugaðu að þessi útreikningur er eingöngu til viðmiðunar og{' '}
                  <span className={styles.taxReturn}>
                    gerir ekki ráð fyrir tekjum eða gögnum úr skattframtali
                  </span>{' '}
                  sem geta haft áhrif á þína aðstoð. Þú færð skilaboð þegar
                  frekari útreikningur liggur fyrir.
                </Text>
              }
            />
          </>
        )}
        <Box marginTop={[4, 4, 5]}>
          <Divider />
        </Box>
        <UserInfo />
        <FormInfo info={formInfoOverview} error={formError.status} />

        <ContactInfo
          phone={form.phoneNumber}
          email={form.emailAddress}
          error={formError.status}
        />

        <Divider />
        <AllFiles />
        <FormComment />
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
          setIsVisible={(isModalVisible) => {
            setIsVisible(isModalVisible)
          }}
        />
      </ContentContainer>

      <Footer
        onPrevButtonClick={() => {
          setIsVisible(!isVisible)
        }}
        previousIsDestructive={true}
        prevButtonText="Hætta við"
        nextIsLoading={isLoading}
        nextButtonText={'Senda umsókn'}
        onNextButtonClick={handleNextButtonClick}
      />
    </>
  )
}

export default SummaryForm
