import React, { useEffect, useState, useContext, useReducer } from 'react'
import { Text, InputFileUpload, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import * as styles from './incomeFilesForm.treat'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'

import { NavigationProps } from '@island.is/financial-aid/types'

const IncomeFilesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const [state, dispatch] = useReducer(form?.incomeFiles, form?.incomeFiles)
  const [error, setError] = useState<string | undefined>(undefined)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Gögn
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Við þurfum að sjá gögn um tekjur í þessum og síðasta mánuði. Þú getur
          smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í
          heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá.
        </Text>

        <div className={styles.fileContainer}>
          <Box className={styles.files}>
            <InputFileUpload
              fileList={[]}
              header="Dragðu gögn hingað"
              description="Tekið er við öllum hefðbundnum skráargerðum"
              buttonLabel="Bættu við gögnum"
              onChange={() => {}}
              onRemove={() => {}}
              // errorMessage={state.length > 0 ? error : undefined}
            />
          </Box>
        </div>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextButtonText="Skila gögnum seinna"
        onNextButtonClick={() => {
          router.push(navigation?.nextUrl ?? '/')
        }}
      />
    </FormLayout>
  )
}

export default IncomeFilesForm
