import React, { useEffect, useState, useContext, useReducer } from 'react'
import {
  Text,
  InputFileUpload,
  Box,
  LinkContext,
} from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import * as styles from './taxReturnForm.treat'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'

import { NavigationProps } from '@island.is/financial-aid/shared'

const TaxReturnForm = () => {
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
          <Text marginBottom={[4, 4, 5]}>
            Á vef Skattsins finnur þú{' '}
            <a href="https://www.skatturinn.is/einstaklingar/framtal-og-alagning/stadfest-afrit-framtals/">
              leiðbeiningar
            </a>{' '}
            um hvernig sækja má staðfest afrit skattframtals.
          </Text>
        </LinkContext.Provider>

        <div className={styles.fileContainer}>
          <Box className={styles.files} marginBottom={2}>
            <InputFileUpload
              fileList={[]}
              header="Dragðu skattframtalið hingað"
              description="Tekið er við öllum hefðbundnum skráargerðum"
              buttonLabel="Bættu við gögnum"
              onChange={() => {}}
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
        previousUrl={navigation?.prevUrl ?? '/'}
        nextButtonText="Halda áfram"
        onNextButtonClick={() => {
          router.push(navigation?.nextUrl ?? '/')
        }}
      />
    </FormLayout>
  )
}

export default TaxReturnForm
