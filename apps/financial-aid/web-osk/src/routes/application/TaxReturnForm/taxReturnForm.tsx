import React, { useEffect, useContext } from 'react'
import {
  Text,
  InputFileUpload,
  Box,
  LinkContext,
} from '@island.is/island-ui/core'

import {
  FileUploadContainer,
  ContentContainer,
  Footer,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'

const TaxReturnForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useFileUpload(form.taxReturnFiles)

  useEffect(() => {
    const formFiles = files.filter((f) => f.status === 'done')

    updateForm({ ...form, taxReturnFiles: formFiles })
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
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Skattframtal
        </Text>

        <Text marginBottom={[4, 4, 5]}>
          Við þurfum að fá afrit af nýjasta skattframtali þínu. Skattframtal er
          staðfesting á öllum þeim tekjum, eignum og skuldum sem þú áttir á
          skattárinu sem leið og er nauðsynlegt fylgigagn fyrir úrvinnslu á
          fjárhagsaðstoð.
        </Text>

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

        <FileUploadContainer>
          <InputFileUpload
            fileList={files}
            header="Dragðu skattframtalið hingað"
            description="Tekið er við öllum hefðbundnum skráargerðum"
            buttonLabel="Bættu við gögnum"
            showFileSize={true}
            errorMessage={uploadErrorMessage}
            onChange={onChange}
            onRemove={onRemove}
            onRetry={onRetry}
          />
        </FileUploadContainer>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        nextButtonText="Halda áfram"
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default TaxReturnForm
