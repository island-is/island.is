import React, { useEffect, useContext } from 'react'

import {
  Footer,
  FormLayout,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'

const IncomeFilesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const { files } = useFileUpload(form.incomeFiles)

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
      <Files
        headline="Tekjugögn"
        about="Við þurfum að sjá gögn um tekjur í þessum og síðasta mánuði. Þú getur
        smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í
        heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá."
      />

      <Footer
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
