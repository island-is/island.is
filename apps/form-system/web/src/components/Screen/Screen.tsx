import { FormSystemField } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/ui'
import { AlertMessage, Box, GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Footer } from '../Footer/Footer'
import { Applicants } from './components/Applicants/Applicants'
import { Completed } from './components/Completed/Completed'
import { ExternalData } from './components/ExternalData/ExternalData'
import { Field } from './components/Field/Field'
import { Summary } from './components/Summary/Summary'
import { NotificationCommands } from '@island.is/form-system/enums'
import { useMutation } from '@apollo/client'
import {
  NOTIFY_EXTERNAL_SERVICE,
  removeTypename,
} from '@island.is/form-system/graphql'
import { LoadingScreen } from '@island.is/react/components'

export const Screen = () => {
  const { state, dispatch } = useApplicationContext()
  const { lang } = useLocale()
  const { currentSection, currentScreen } = state
  const [notifyExternal] = useMutation(NOTIFY_EXTERNAL_SERVICE)
  const [loading, setLoading] = useState(false)

  const screenTitle =
    currentScreen?.data?.name?.[lang] ??
    (currentSection?.data?.sectionType === SectionTypes.COMPLETED
      ? null
      : state.sections?.[currentSection?.index]?.name?.[lang] ?? '')

  const currentSectionType = state.sections?.[currentSection.index]?.sectionType
  const [externalDataAgreement, setExternalDataAgreement] = useState(
    state.sections?.[0].isCompleted ?? false,
  )

  const shouldPopulateScreen = async () => {
    if (
      currentScreen?.data?.shouldPopulate &&
      state.application.submissionServiceUrl !== 'zendesk'
    ) {
      try {
        setLoading(true)
        const { data } = await notifyExternal({
          variables: {
            input: {
              applicationId: state.application.id,
              nationalId: '',
              slug: state.application.slug,
              isTest: state.application.isTest,
              command: NotificationCommands.POPULATE,
              screen: state.currentScreen?.data,
            },
          },
        })

        const updatedScreen = removeTypename(
          data?.notifyFormSystemExternalSystem?.screen,
        )

        dispatch({
          type: 'EXTERNAL_SERVICE_NOTIFICATION',
          payload: {
            screen: updatedScreen,
            ...(updatedScreen?.screenError?.hasError && {
              isPopulateError: true,
            }),
          },
        })
      } catch (error) {
        console.error('Error populating fields:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const populateScreen = async () => {
      await shouldPopulateScreen()
    }
    populateScreen()
  }, [currentScreen?.data?.id])

  if (loading) return <LoadingScreen ariaLabel="loading" />

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <GridColumn
        span={['12/12', '12/12', '10/12', '7/9']}
        offset={['0', '0', '1/12', '1/9']}
      >
        {state.screenError && state.screenError.hasError && (
          <Box marginBottom={[4, 4, 5]}>
            <AlertMessage
              type="error"
              title={state.screenError.title?.[lang]}
              message={
                <Text variant="small" whiteSpace="breakSpaces">
                  {state.screenError.message?.[lang]}
                </Text>
              }
            />
          </Box>
        )}

        <Text variant="h2" as="h2" marginBottom={1}>
          {currentSectionType !== SectionTypes.PREMISES &&
            currentSectionType !== SectionTypes.PARTIES &&
            screenTitle}
        </Text>
        {currentSectionType === SectionTypes.PREMISES && (
          <ExternalData setExternalDataAgreement={setExternalDataAgreement} />
        )}
        {currentSectionType === SectionTypes.PARTIES && (
          <Applicants
            applicantField={currentScreen?.data?.fields?.[0] as FormSystemField}
          />
        )}
        {currentSectionType === SectionTypes.SUMMARY &&
          !!state.application.hasSummaryScreen &&
          !currentSection?.data?.isHidden && <Summary state={state} />}

        {currentSectionType === SectionTypes.COMPLETED && <Completed />}
        {currentScreen &&
          currentScreen?.data?.fields
            ?.filter(
              (field): field is NonNullable<typeof field> =>
                field != null && !field.isHidden,
            )
            .map((field, index) => {
              return <Field field={field} key={index} />
            })}
      </GridColumn>
      <Footer externalDataAgreement={externalDataAgreement} />
    </Box>
  )
}
