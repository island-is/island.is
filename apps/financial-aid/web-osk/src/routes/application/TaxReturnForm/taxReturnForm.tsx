import React, { useContext } from 'react'
import { Text, AlertMessage, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'
import { getTaxFormContent } from './taxFormContent'

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
  const directTaxPaymentsFetchedFailed = form.directTaxPayments.length === 0

  const taxDataGatheringFailed =
    taxReturnFetchFailed && directTaxPaymentsFetchedFailed

  const content = getTaxFormContent(
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
              message="Það náðist ekki tenging við Skattinn"
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

const getContent = (fetchFailed: boolean) => {
  return {
    data: fetchFailed ? (
      <Text marginBottom={2}>
        Við þurfum að fá afrit af nýjasta <strong>skattframtali</strong> þínu og
        staðfestingarskjal úr <strong>staðreiðsluskrá</strong> Skattsins.
      </Text>
    ) : (
      <Text marginBottom={2}>
        Við þurfum að fá afrit úr <strong>staðreiðsluskrá</strong> Skattsins.
      </Text>
    ),
    reason: fetchFailed ? (
      <Text marginBottom={[4, 4, 5]}>
        Við þurfum að fá afrit af nýjasta skattframtali þínu. Skattframtal er
        staðfesting á öllum þeim tekjum, eignum og skuldum sem þú áttir á
        skattárinu sem leið og er nauðsynlegt fylgigagn fyrir úrvinnslu á
        fjárhagsaðstoð.
      </Text>
    ) : (
      <Text marginBottom={[4, 4, 5]}>
        Staðgreiðsluskrá er staðfesting/yfirlit frá Skattinum um skattskyldar
        tekjur umsækjanda á árinu. Það er nauðsynlegt fylgigagn fyrir úrvinnslu
        umsóknar um fjárhagsaðstoð.
      </Text>
    ),
  }
}

export default TaxReturnForm
