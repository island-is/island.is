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
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFIleUpload'

const IncomeFilesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useFileUpload(form.incomeFiles)

  useEffect(() => {
    const formFiles = files.filter((f) => f.status === 'done')

    updateForm({ ...form, incomeFiles: formFiles })
  }, [files])

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const errorCheck = () => {
    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
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
              fileList={files}
              header="Dragðu gögn hingað"
              description="Tekið er við öllum hefðbundnum skráargerðum"
              buttonLabel="Bættu við gögnum"
              showFileSize={true}
              errorMessage={uploadErrorMessage}
              onChange={onChange}
              onRemove={onRemove}
              onRetry={onRetry}
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
        nextButtonText={
          files.length > 0 ? 'Halda áfram' : 'Skila gögnum seinna'
        }
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default IncomeFilesForm
