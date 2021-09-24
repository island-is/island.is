import React, { useContext } from 'react'

import {
  Footer,
  Files,
  ContentContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { Text } from '@island.is/island-ui/core'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const IncomeFilesForm = () => {
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

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Tekjugögn
        </Text>
        <Text marginBottom={[3, 3, 5]}>
          Við þurfum að sjá gögn um tekjur í þessum og síðasta mánuði. Þú getur
          smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í
          heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá.
        </Text>
        <Files
          header="Dragðu gögn hingað"
          fileKey="incomeFiles"
          uploadFiles={form.incomeFiles}
        />
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        nextButtonText={
          form.incomeFiles.length > 0 ? 'Halda áfram' : 'Skila gögnum seinna'
        }
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default IncomeFilesForm
