import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { FormStepper, m, SectionTypes } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Header,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client/react'
import { LocaleContext, MessagesDict, useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import { Locale } from '@island.is/shared/types'
import gql from 'graphql-tag'
import { IntlProvider } from 'react-intl'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { FormProvider, useForm } from 'react-hook-form'
import { NavbarSelectStatus } from '../../../../lib/utils/interfaces'
import { Preview } from '../Preview/Preview'
import { MultiSet } from './components/MultiSet'
import { PreviewCompleted } from './components/PreviewCompleted'
import { PreviewPremises, PreviewSummary } from './components/PreviewSections'
import { getPreviewSteps, updatePreviewFields } from './previewState'
import * as styles from './PreviewStepOrGroup.css'

interface Props {
  setOpenPreview: Dispatch<SetStateAction<boolean>>
}

const focusPreviewHeading = (element: HTMLDivElement | null) => {
  element?.focus({ preventScroll: true })
}

const GET_PREVIEW_TRANSLATIONS = gql`
  query GetTranslations($input: GetTranslationsInput!) {
    getTranslations(input: $input)
  }
`

export const PreviewStepOrGroup = (props: Props) => {
  const portalLocale = useContext(LocaleContext)
  const [lang, setLang] = useState<Locale>('is')
  const { data, loading } = useQuery<{ getTranslations: MessagesDict }>(
    GET_PREVIEW_TRANSLATIONS,
    {
      variables: {
        input: { namespaces: portalLocale.loadedNamespaces, lang },
      },
      skip: portalLocale.loadedNamespaces.length === 0,
    },
  )
  const messages =
    data?.getTranslations ??
    (lang === portalLocale.lang ? portalLocale.messages : {})

  return (
    <LocaleContext.Provider
      value={{
        ...portalLocale,
        lang,
        messages,
        loadingMessages: loading,
        changeLanguage: setLang,
      }}
    >
      <IntlProvider locale={lang} defaultLocale="is" messages={messages}>
        <PreviewStepOrGroupContent {...props} />
      </IntlProvider>
    </LocaleContext.Provider>
  )
}

const PreviewStepOrGroupContent = ({ setOpenPreview }: Props) => {
  const { control, setSelectStatus } = useContext(ControlContext)
  const { lang, formatMessage, changeLanguage } = useLocale()
  const { activeItem, form } = control
  const { screens, fields } = form
  const methods = useForm()
  const [previewFields, previewDispatch] = useReducer(
    updatePreviewFields,
    (fields ?? []).filter((field): field is FormSystemField => !!field),
  )

  useEffect(() => {
    setSelectStatus(NavbarSelectStatus.ON_WITHOUT_SELECT)
    return () => setSelectStatus(NavbarSelectStatus.OFF)
  }, [setSelectStatus])

  const sections: FormSystemSection[] = (form.sections ?? [])
    .filter((section): section is FormSystemSection => !!section)
    .map((section) => ({
      ...section,
      screens: (screens ?? [])
        .filter(
          (screen): screen is FormSystemScreen =>
            !!screen && screen.sectionId === section.id,
        )
        .map((screen) => ({
          ...screen,
          fields: previewFields.filter((field) => field.screenId === screen.id),
        })),
    }))

  const previewSteps = getPreviewSteps(sections)
  const [screenIndex, setScreenIndex] = useState(() => {
    const selectedScreenId =
      activeItem.type === 'Field'
        ? (activeItem.data as FormSystemField | undefined)?.screenId
        : activeItem.data?.id
    const selectedIndex = previewSteps.findIndex((step) =>
      activeItem.type === 'Section'
        ? step.section.id === activeItem.data?.id
        : step.screen?.id === selectedScreenId,
    )
    return Math.max(0, selectedIndex)
  })
  const currentStep = previewSteps[screenIndex]
  const currentScreen = currentStep?.screen
  const previewState = {
    currentScreen: { index: screenIndex, data: currentScreen },
  }
  const currentSection = currentStep?.section
  const sectionIndex = currentStep?.sectionIndex ?? 0
  const sectionType = currentSection?.sectionType
  const organizationName =
    form.organizationDisplayName?.[lang] ||
    (lang === 'en' ? form.organizationTitleEn : form.organizationTitle) ||
    ''

  return (
    <ModalBase
      baseId="formContentPreview"
      modalLabel={formatMessage(m.preview)}
      initialVisibility
      className={styles.previewModal}
      onVisibilityChange={setOpenPreview}
    >
      {({ closeModal }) => (
        <FormProvider {...methods}>
          <div ref={focusPreviewHeading} tabIndex={-1}>
            <GridContainer>
              <Header
                info={{
                  title: organizationName,
                  description: form.name?.[lang] ?? '',
                }}
                headerItems={
                  <Box
                    display="flex"
                    alignItems="center"
                    columnGap={2}
                    marginRight={[1, 1, 2]}
                  >
                    <Button
                      variant="utility"
                      colorScheme="white"
                      onClick={() =>
                        changeLanguage(lang === 'en' ? 'is' : 'en')
                      }
                      aria-label={formatMessage(
                        lang === 'en'
                          ? sharedMessages.switchToIcelandic
                          : sharedMessages.switchToEnglish,
                      )}
                      data-testid="preview-language-switcher-button"
                    >
                      {lang === 'en' ? 'IS' : 'EN'}
                    </Button>
                    <Button
                      variant="utility"
                      colorScheme="white"
                      icon="close"
                      onClick={closeModal}
                    >
                      Loka sýnishorni
                    </Button>
                  </Box>
                }
              />
            </GridContainer>
          </div>
          <Box className={styles.application}>
            <Box
              paddingTop={[0, 4]}
              paddingLeft={[0, 4]}
              paddingBottom={[0, 5]}
              width="full"
            >
              <GridContainer>
                <GridRow>
                  <GridColumn
                    span={['12/12', '12/12', '9/12', '9/12']}
                    className={styles.shellContainer}
                  >
                    <Box
                      paddingTop={[3, 6, 10]}
                      height="full"
                      borderRadius="large"
                      background="white"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="spaceBetween"
                        height="full"
                      >
                        <GridColumn
                          span={['12/12', '12/12', '10/12', '7/9']}
                          offset={['0', '0', '1/12', '1/9']}
                        >
                          {sectionType !== SectionTypes.PREMISES &&
                            sectionType !== SectionTypes.PARTIES &&
                            sectionType !== SectionTypes.COMPLETED && (
                              <Text variant="h2" as="h2" marginBottom={1}>
                                {currentScreen?.name?.[lang] ??
                                  currentSection?.name?.[lang]}
                              </Text>
                            )}
                          {sectionType === SectionTypes.PREMISES && (
                            <PreviewPremises form={form} />
                          )}
                          {sectionType === SectionTypes.COMPLETED && (
                            <PreviewCompleted form={form} />
                          )}
                          {sectionType === SectionTypes.SUMMARY && (
                            <PreviewSummary
                              sections={sections}
                              onNavigate={(sectionId, screenId) => {
                                const index = previewSteps.findIndex((step) =>
                                  screenId
                                    ? step.screen?.id === screenId
                                    : step.section.id === sectionId,
                                )
                                if (index >= 0) setScreenIndex(index)
                              }}
                            />
                          )}
                          {currentScreen &&
                            sectionType !== SectionTypes.PREMISES &&
                            sectionType !== SectionTypes.SUMMARY &&
                            sectionType !== SectionTypes.COMPLETED &&
                            (currentScreen.isMulti &&
                            (currentScreen.multiMax ?? 1) > 1 ? (
                              <MultiSet
                                key={currentScreen.id}
                                screen={currentScreen}
                                dispatch={previewDispatch}
                                state={previewState}
                              />
                            ) : (
                              currentScreen.fields
                                ?.filter(
                                  (field): field is FormSystemField =>
                                    !!field && !field.isHidden,
                                )
                                .map((field) => (
                                  <Preview
                                    key={field.id}
                                    data={field}
                                    dispatch={previewDispatch}
                                    state={previewState}
                                    screenOrSection
                                  />
                                ))
                            ))}
                        </GridColumn>
                        <Box marginTop={7} className={styles.footer}>
                          <GridColumn
                            span={['12/12', '12/12', '10/12', '7/9']}
                            offset={['0', '0', '1/12', '1/9']}
                          >
                            <Box
                              display="flex"
                              flexDirection="rowReverse"
                              alignItems="center"
                              justifyContent="spaceBetween"
                              paddingTop={[1, 4]}
                            >
                              <Box
                                display="inlineFlex"
                                padding={2}
                                paddingRight="none"
                              >
                                {screenIndex < previewSteps.length - 1 ? (
                                  <Button
                                    icon="arrowForward"
                                    onClick={() =>
                                      setScreenIndex(screenIndex + 1)
                                    }
                                  >
                                    {formatMessage(m.continue)}
                                  </Button>
                                ) : (
                                  <Button onClick={closeModal}>
                                    Loka sýnishorni
                                  </Button>
                                )}
                              </Box>
                              <Box
                                display="inlineFlex"
                                padding={2}
                                paddingLeft="none"
                              >
                                <Button
                                  variant="ghost"
                                  preTextIcon="arrowBack"
                                  disabled={screenIndex === 0}
                                  onClick={() =>
                                    setScreenIndex(screenIndex - 1)
                                  }
                                >
                                  {formatMessage(m.back)}
                                </Button>
                              </Box>
                            </Box>
                          </GridColumn>
                        </Box>
                      </Box>
                    </Box>
                  </GridColumn>
                  <GridColumn
                    span={['12/12', '12/12', '3/12', '3/12']}
                    className={styles.sidebarContainer}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="spaceBetween"
                      height="full"
                      paddingTop={[0, 0, 8]}
                      paddingLeft={[0, 0, 0, 4]}
                    >
                      <FormStepper
                        sections={sections}
                        currentSection={{
                          data: currentSection,
                          index: sectionIndex,
                        }}
                        currentScreen={
                          currentScreen ? { data: currentScreen } : undefined
                        }
                        hasSummaryScreen={sections.some(
                          (section) =>
                            section.sectionType === SectionTypes.SUMMARY,
                        )}
                        hasPayment={false}
                        submitted={false}
                      />
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </Box>
        </FormProvider>
      )}
    </ModalBase>
  )
}
