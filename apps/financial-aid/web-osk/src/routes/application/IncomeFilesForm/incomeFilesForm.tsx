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

import { NavigationProps } from '@island.is/financial-aid/shared'

const IncomeFilesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const [state, dispatch] = useReducer(form?.incomeFiles, form?.incomeFiles)
  const [error, setError] = useState<string>()

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const errorCheck = () => {
    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  const onChange = (files: File[]) => {
    console.log(files)

    files.forEach((file) => {
      uploadToCloudFront(file)
    })
  }

  const uploadToCloudFront = (file: File) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.open(
      'PUT',
      'https://fjarhagsadstod.dev.sveitarfelog.net/files/js-test.jpg?Expires=1625067466&Key-Pair-Id=K2DUN2ISOH197V&Signature=gzPhzi1T6sZT9oBBXLdCy~aBDBfjuN~eWl7q4uwIrg7dmMFErF4iNH1F8p2ZV69vobt2tz-29cUrujToReUogoy~~9r-ptSEbYoqzFQO~ZuDOdE7Zl8M~fmrj9z~Nnfu0pR7SFKbfxyi-WPW18wSJDIzqfnw0gD5ssUjQC092JxA-CUWzVss1KI06b3ueLrV7NNH0I~zZeeU9b631aonlQOLe~F5SPVeMw4OlUcUUn4o5blhR9A4dENmlD3yWCZmuCiIcobpgn2cJiT9ras~IO-UR~9A-T-xE486DT4tg~rQookil6TqKvT82tVg2bjjQLKce9U8An84ljB7~q9aZg__',
    )

    const formData = new FormData()

    formData.append('file', file)

    request.send(formData)
  }

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Tekjugögn
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Við þurfum að sjá gögn um tekjur í þessum og síðasta mánuði. Þú getur
          smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í
          heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá.
        </Text>

        <div className={styles.fileContainer}>
          <Box className={styles.files} marginBottom={[1, 1, 2]}>
            <InputFileUpload
              fileList={[]}
              header="Dragðu gögn hingað"
              description="Tekið er við öllum hefðbundnum skráargerðum"
              buttonLabel="Bættu við gögnum"
              onChange={onChange}
              onRemove={() => {}}
              // errorMessage={state.length > 0 ? error : undefined}
            />
          </Box>
          <div
            className={cn({
              [`errorMessage ${styles.files}`]: true,
              [`showErrorMessage`]: false,
            })}
          >
            <Text color="red600" fontWeight="semiBold" variant="small">
              Þú þarft að hlaða upp gögnum
            </Text>
          </div>
        </div>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl}
        nextButtonText="Skila gögnum seinna"
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default IncomeFilesForm
