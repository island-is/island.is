import React, { useContext } from 'react'
import { Text, LinkContext, AlertMessage, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const TaxReturnForm = () => {
  const router = useRouter()

  const { form } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const errorCheck = () => {
    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  const taxReturnFetchFailed = form.taxReturnFromRskFile.length === 0
  const directTaxPaymentsFetchedFailed = form.directTaxPayments === undefined
  const taxDataGatheringFailed =
    taxReturnFetchFailed && directTaxPaymentsFetchedFailed

  const content = getContent(
    taxReturnFetchFailed,
    directTaxPaymentsFetchedFailed,
  )

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={4}>
          Skattagögn
        </Text>

        {taxDataGatheringFailed && (
          <Box marginBottom={4}>
            <AlertMessage
              type="error"
              title="Ekki tókst að sækja skattframtal og staðgreiðsluskrá"
              message="Það náðist ekki tenging við skattinn"
            />
          </Box>
        )}

        {content.data}

        {content.reason}

        <Files
          header="Dragðu gögn hingað"
          fileKey="taxReturnFiles"
          uploadFiles={form.taxReturnFiles}
        />

        {content.info}
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        nextButtonText={
          form.taxReturnFiles.length > 0 ? 'Halda áfram' : 'Skila gögnum seinna'
        }
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

const DirectTaxPaymentsInfo = () => {
  return (
    <>
      <Text as="h2" variant="h3" marginBottom={2}>
        Hvar finn ég staðfestingarskjal úr staðgreiðsluskrá?
      </Text>
      <Text marginBottom={[3, 3, 10]}>
        Eftir að þú hefur innskráð þig á Þjónustuvef Skattsins ferð þú í Almennt
        → Staðgreiðsluskrá RSK → Sækja PDF.
      </Text>
    </>
  )
}

const TaxReturnInfo = () => {
  return (
    <>
      <Text as="h2" variant="h3" marginBottom={2}>
        Hvar finn ég staðfest afrit af mínu skattframtali?
      </Text>

      <LinkContext.Provider
        value={{
          linkRenderer: (href, children) => (
            <a
              style={{
                color: '#0061ff',
              }}
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
        }}
      >
        <Text marginBottom={[3, 3, 5]}>
          Á vef Skattsins finnur þú{' '}
          <a href="https://www.skatturinn.is/einstaklingar/framtal-og-alagning/stadfest-afrit-framtals/">
            leiðbeiningar
          </a>{' '}
          um hvernig sækja má staðfest afrit skattframtals.
        </Text>
      </LinkContext.Provider>
    </>
  )
}

const getContent = (
  taxReturnFailed: boolean,
  directTaxPaymentsFailed: boolean,
) => {
  switch (true) {
    case taxReturnFailed && !directTaxPaymentsFailed:
      return {
        data: (
          <Text marginBottom={2}>
            Við þurfum að fá afrit af nýjasta <strong>skattframtali</strong>{' '}
            þínu þar sem ekki náðist að sækja gögnin sjálfvirkt.
          </Text>
        ),
        reason: (
          <Text marginBottom={[4, 4, 5]}>
            Skattframtal er staðfesting á öllum þeim tekjum, eignum og skuldum
            sem þú áttir á skattárinu og er nauðsynlegt fylgigagn fyrir
            úrvinnslu á fjárhagsaðstoð.
          </Text>
        ),
        info: <TaxReturnInfo />,
      }
    case directTaxPaymentsFailed && !taxReturnFailed:
      return {
        data: (
          <Text marginBottom={2}>
            Við þurfum að fá afrit úr <strong>staðreiðsluskrá</strong> Skattsins
            þar sem ekki náðist að sækja gögnin sjálfvirkt.
          </Text>
        ),
        reason: (
          <Text marginBottom={[4, 4, 5]}>
            Staðgreiðsluskrá er staðfesting/yfirlit frá Skattinum um
            skattskyldar tekjur umsækjanda á árinu. Það er nauðsynlegt fylgigagn
            fyrir úrvinnslu umsóknar um fjárhagsaðstoð.
          </Text>
        ),
        info: <DirectTaxPaymentsInfo />,
      }

    case taxReturnFailed && directTaxPaymentsFailed:
    default:
      return {
        data: (
          <Text marginBottom={2}>
            Við þurfum að fá afrit af nýjasta <strong>skattframtali</strong>{' '}
            þínu og staðfestingarskjal úr <strong>staðreiðsluskrá</strong>{' '}
            Skattsins þar sem ekki tókst að sækja gögnin sjálfvikrt.
          </Text>
        ),
        reason: (
          <Text marginBottom={[4, 4, 5]}>
            Skattframtal er staðfesting á öllum þeim tekjum, eignum og skuldum
            sem þú áttir á skattárinu og staðgreiðsluskrá er staðfesting/yfirlit
            frá Skattinum um skattskyldar tekjur umsækjanda á árinu. Bæði gögn
            eru nauðsynleg fylgigögn fyrir úrvinnslu á fjárhagsaðstoð.
          </Text>
        ),
        info: (
          <>
            <TaxReturnInfo />
            <DirectTaxPaymentsInfo />
          </>
        ),
      }
  }
}

export default TaxReturnForm
