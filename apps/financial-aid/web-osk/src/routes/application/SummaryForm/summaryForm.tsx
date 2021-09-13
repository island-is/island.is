import React, { useState, useContext } from 'react'
import {
  Text,
  Divider,
  Box,
  Button,
  Input,
  Icon,
} from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  FormLayout,
  CancelModal,
  Estimation,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { useRouter } from 'next/router'

import * as styles from './summaryForm.treat'
import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import {
  NavigationProps,
  getHomeCircumstances,
  HomeCircumstances,
  Employment,
  getEmploymentStatus,
  formatPhoneNumber,
  formatNationalId,
  Routes,
} from '@island.is/financial-aid/shared/lib'

import useApplication from '@island.is/financial-aid-web/osk/src/utils/useApplication'

const SummaryForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const { user } = useContext(UserContext)

  const [isVisible, setIsVisible] = useState(false)

  const [formError, setFormError] = useState({
    status: false,
    message: '',
  })

  const { createApplication } = useApplication()

  const allFiles = form.incomeFiles
    .concat(form.taxReturnFiles)
    .concat(form.otherFiles)

  const handleNextButtonClick = async () => {
    if (!form || !user) {
      return
    }
    try {
      await createApplication(form, user).then(() => {
        if (navigation?.nextUrl) {
          router.push(navigation.nextUrl)
        }
      })
    } catch (e) {
      setFormError({
        status: true,
        message: 'Obobb einhvað fór úrskeiðis',
      })
    }
  }

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
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Yfirlit umsóknar
        </Text>

        <Estimation
          usePersonalTaxCredit={form.usePersonalTaxCredit}
          homeCircumstances={form.homeCircumstances}
          aboutText={
            <Text marginBottom={[2, 2, 3]}>
              Athugaðu að þessi útreikningur er eingöngu til viðmiðunar og{' '}
              <span className={styles.taxReturn}>
                gerir ekki ráð fyrir tekjum eða gögnum úr skattframtali
              </span>{' '}
              sem geta haft áhrif á þína aðstoð. Þú færð skilaboð þegar frekari
              útreikningur liggur fyrir.
            </Text>
          }
        />

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
              {allFiles && (
                <>
                  {allFiles.map((file, index) => {
                    return (
                      <a
                        href={file.name}
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
              router.push(Routes.filesPage)
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
      </ContentContainer>

      <Footer
        onPrevButtonClick={() => {
          setIsVisible(!isVisible)
        }}
        previousIsDestructive={true}
        prevButtonText="Hætta við"
        nextButtonText="Senda umsókn"
        onNextButtonClick={handleNextButtonClick}
      />
    </FormLayout>
  )
}

export default SummaryForm
