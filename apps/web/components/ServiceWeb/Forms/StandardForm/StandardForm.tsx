import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { FormatInputValueFunction } from 'react-number-format'
import { useDebounce } from 'react-use'
import { useLazyQuery } from '@apollo/client'
import slugify from '@sindresorhus/slugify'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Link,
  LinkContext,
  LoadingDots,
  Option,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'
import { sortAlpha } from '@island.is/shared/utils'
import {
  ContentLanguage,
  GetSupportSearchResultsQuery,
  GetSupportSearchResultsQueryVariables,
  Organizations,
  SearchableContentTypes,
  SupportCategory,
  SupportQna,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { GET_SUPPORT_SEARCH_RESULTS_QUERY } from '@island.is/web/screens/queries'
import {
  FiskistofaCategories,
  SjukratryggingarCategories,
  VinnueftirlitidCategories,
} from '@island.is/web/screens/ServiceWeb/Forms/utils'
import { getServiceWebSearchTagQuery } from '@island.is/web/screens/ServiceWeb/utils'

import { FormNamespace } from '../../types'
import { CategoryId, SyslumennCategories } from './types'

type FormState = {
  message: string
  name: string
  email: string
  category: string
  syslumadur: string
  subject: string
  institutionSlug: string
}

interface StandardFormProps {
  syslumenn?: Organizations['items']
  supportCategories?: SupportCategory[]
  loading: boolean
  onSubmit: (formState: FormState) => Promise<void>
  institutionSlug: string
  namespace?: Record<string, string>
  stateEntities: string[]
  formNamespace: FormNamespace
}

const labels: Record<string, string> = {
  syslumadur: 'Sýslumannsembætti',
  nafn: 'Nafn',
  email: 'Tölvupóstfang',
  malaflokkur: 'Málaflokkur',
  nafn_malsadila: 'Nafn málsaðila',
  kennitala_malsadila: 'Kennitala málsaðila',
  malsnumer: 'Málsnúmer',
  nafn_leyfishafa: 'Nafn leyfishafa',
  nafn_hins_latna: 'Nafn hins látna',
  kennitala_hins_latna: 'Kennitala hins látna',
  kennitala_arftaka: 'Kennitala arftaka',
  kennitala_leyfishafa: 'Kennitala leyfishafa',
  fastanumer_eignar: 'Fastanúmer eignar',
  skraningarnumer_okutaekis: 'Skráningarnúmer ökutækis',
  kennitala_vegna_lausafes: 'Kennitala vegna lausafés',
  erindi: 'Erindi',
  vidfangsefni: 'Viðfangsefni',
  starfsheiti: 'Starfsheiti',
  rikisadili: 'Ríkisaðili',
  kennitala: 'Kennitala',
  malsnumer_ef_til_stadar: 'Málsnúmer (ef til staðar)',
  faedingardagur_eda_kennitala_malsadila: 'Fæðingardagur/Kennitala málsaðila',
  skipaskrarnumer: 'Skipaskrárnúmer',
  vinnuvelanumer_kaupanda: 'Vinnuvélanúmer kaupanda',
  vinnuvelanumer_seljanda: 'Vinnuvélanúmer seljanda',
  vinnuvelanumer_vegna_skodunar: 'Vinnuvélanúmer vegna skoðunar',
  stadsetning_taekis: 'Staðsetning tækis',
  stadsetning_verkstadar: 'Staðsetning verkstaðar',
  nafn_fyrirtaekis: 'Nafn fyrirtækis',
  starfsstod: 'Starfsstöð',
  oska_eftir_vernd_uppljostrara: 'Óska eftir vernd uppljóstrara',
  kennitala_thess_sem_malid_vardar: 'Kennitala þess sem málið varðar',
}

// these should be skipped in the message itself
const skippedLabelsInMessage: Array<keyof typeof labels> = [
  'nafn',
  'vidfangsefni',
  'erindi',
]

const useFormNamespace =
  (namespace: FormNamespace) =>
  (
    key: string,
    type: 'label' | 'requiredMessage' | 'placeholder' | 'patternMessage',
    fallback?: string,
  ) => {
    return namespace?.[key]?.[type] ?? fallback
  }

interface BasicInputProps {
  name: keyof typeof labels
  requiredMessage?: string
  format?: string | FormatInputValueFunction
  label?: string
}

const BasicInput = ({
  name,
  requiredMessage,
  format,
  label,
}: BasicInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()

  return (
    <InputController
      backgroundColor="blue"
      id={name}
      name={name}
      label={label}
      error={errors?.[name]?.message as string}
      required={!!requiredMessage}
      format={format}
      rules={{
        ...(requiredMessage && {
          required: {
            value: true,
            message: requiredMessage,
          },
        }),
      }}
      // The docs tell us to spread the response of the register function even though it's return type is void
      // https://react-hook-form.com/api/useformcontext/
      {...(register(name) as unknown as object)}
    />
  )
}

interface BasicCheckboxProps {
  name: keyof typeof labels
  label: string
}

const BasicCheckbox = ({ name, label }: BasicCheckboxProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()

  return (
    <CheckboxController
      id={name}
      name={name}
      error={errors?.[name]?.message as string}
      options={[
        {
          label,
          value: 'Já', // This value only gets sent in an email so it can be in only one locale
        },
      ]}
      // The docs tell us to spread the response of the register function even though it's return type is void
      // https://react-hook-form.com/api/useformcontext/
      {...(register(name) as unknown as object)}
    />
  )
}

const MIN_SEARCH_QUERY_LENGTH = 1

export const StandardForm = ({
  syslumenn,
  supportCategories,
  loading,
  onSubmit,
  institutionSlug,
  namespace,
  stateEntities,
  formNamespace,
}: StandardFormProps) => {
  const { activeLocale } = useI18n()
  const useFormMethods = useForm()
  const n = useNamespace(namespace)
  const fn = useFormNamespace(formNamespace)
  const {
    handleSubmit,
    getValues,
    control,
    formState: { isSubmitting, errors },
  } = useFormMethods
  const { linkResolver } = useLinkResolver()
  const [syslumadurId, setSyslumadurId] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [showAllSuggestions, setShowAllSuggestions] = useState<boolean>(false)
  const [lastSubject, setLastSubject] = useState<string>('')
  const [isChangingSubject, setIsChangingSubject] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<Array<SupportQna>>([])
  const [categoryId, setCategoryId] = useState<string>('')
  const [categoryLabel, setCategoryLabel] = useState<string>('')
  const [addonFields, setAddonFields] = useState<ReactNode | null>()
  const categoryDescription = useMemo(
    () =>
      supportCategories?.find((c) => c.id === categoryId)?.description ?? '',
    [categoryId, supportCategories],
  )

  const stateEntityOptions = useMemo(() => {
    const options = [...stateEntities]
    options.sort((a, b) => a.localeCompare(b, 'is-IS'))
    return options.map((option) => ({ label: option, value: slugify(option) }))
  }, [])

  const [fetch, { loading: loadingSuggestions, called, data }] = useLazyQuery<
    GetSupportSearchResultsQuery,
    GetSupportSearchResultsQueryVariables
  >(GET_SUPPORT_SEARCH_RESULTS_QUERY, {
    onCompleted: (updatedData) => {
      setIsChangingSubject(false)
      updateSuggestions(updatedData)
    },
  })

  const institutionSlugBelongsToMannaudstorg =
    institutionSlug.includes('mannaudstorg')

  const institutionSligBelongsToDirectorateOfImmigration =
    institutionSlug === 'utlendingastofnun' ||
    institutionSlug === 'directorate-of-immigration'

  useDebounce(
    () => {
      if (!isChangingSubject) {
        return false
      }

      if (subject === '') {
        setSuggestions([])
        setIsChangingSubject(false)
      }

      if (subject.length > MIN_SEARCH_QUERY_LENGTH) {
        const queryString = subject

        if (subject.trim() === lastSubject.trim()) {
          updateSuggestions()
          setIsChangingSubject(false)
        } else {
          fetch({
            variables: {
              query: {
                language: activeLocale as ContentLanguage,
                queryString,
                size: 10,
                types: [SearchableContentTypes['WebQna']],
                ...getServiceWebSearchTagQuery(institutionSlug),
              },
            },
          })
        }

        setLastSubject(subject)
      }
    },
    1000,
    [subject],
  )

  useEffect(() => {
    if (subject === '') {
      setSuggestions([])
      setIsChangingSubject(false)
    }
  }, [subject])

  const updateSuggestions = (updatedData?: GetSupportSearchResultsQuery) => {
    setSuggestions(
      ((updatedData?.searchResults?.items ??
        data?.searchResults?.items) as Array<SupportQna>) || [],
    )
  }

  useEffect(() => {
    let fields = null

    switch (categoryId as CategoryId) {
      case SyslumennCategories.THINGLYSINGAR:
        fields = (
          <>
            <GridColumn span={['12/12', '12/12', '4/12']} paddingBottom={3}>
              <BasicInput
                name="fastanumer_eignar"
                label={fn('fastanumer_eignar', 'label', 'Fastanúmber eignar')}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '4/12']} paddingBottom={3}>
              <BasicInput
                name="skraningarnumer_okutaekis"
                label={fn(
                  'skraningarnumer_okutaekis',
                  'label',
                  'Skráningarnúmer ökutækis',
                )}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '4/12']} paddingBottom={3}>
              <BasicInput
                name="kennitala_vegna_lausafes"
                format="######-####"
                label={fn(
                  'kennitala_vegna_lausafes',
                  'label',
                  'Kennitala vegna lausafés',
                )}
              />
            </GridColumn>
          </>
        )
        break
      case SyslumennCategories.LEYFI:
        fields = (
          <>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="nafn_leyfishafa"
                requiredMessage="Nafn leyfishafa vantar"
                label={fn('nafn_leyfishafa', 'label', 'Nafn leyfishafa')}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingBottom={3}>
              <BasicInput
                name="kennitala_leyfishafa"
                requiredMessage={fn(
                  'kennitala_leyfishafa',
                  'requiredMessage',
                  'Kennitala leyfishafa vantar',
                )}
                format="######-####"
                label={fn(
                  'kennitala_leyfishafa',
                  'label',
                  'Kennitala leyfishafa',
                )}
              />
            </GridColumn>
          </>
        )
        break
      case SyslumennCategories.GJOLD_OG_INNHEIMTA:
      case SyslumennCategories.SKIRTEINI:
        fields = (
          <GridColumn span={['12/12', '6/12']} paddingBottom={3}>
            <BasicInput
              name="kennitala_malsadila"
              requiredMessage="Kennitala málsaðila vantar"
              format="######-####"
              label={fn('kennitala_malsadila', 'label', 'Kennitala málsaðila')}
            />
          </GridColumn>
        )
        break
      case SyslumennCategories.FULLNUSTUGERDIR:
      case SyslumennCategories.LOGRADAMAL:
      case SyslumennCategories.FJOLSKYLDUMAL:
        fields = (
          <>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="nafn_malsadila"
                requiredMessage={fn(
                  'nafn_malsadila',
                  'requiredMessage',
                  'Nafn málsaðila vantar',
                )}
                label={fn('nafn_malsadila', 'label', 'Nafn málsaðila')}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingBottom={3}>
              <BasicInput
                name="kennitala_malsadila"
                format="######-####"
                label={fn(
                  'kennitala_malsadila',
                  'label',
                  'Kennitala málsaðila',
                )}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingBottom={3}>
              <BasicInput
                name="malsnumer"
                label={fn('malsnumer', 'label', 'Málsnúmer')}
              />
            </GridColumn>
          </>
        )
        break
      case SyslumennCategories.ANDLAT_OG_DANARBU:
        fields = (
          <>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="nafn_hins_latna"
                requiredMessage="Nafn hins látna vantar"
                label={fn('nafn_hins_latna', 'label', 'Nafn hins látna')}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingBottom={3}>
              <BasicInput
                name="kennitala_hins_latna"
                format="######-####"
                label={fn(
                  'kennitala_hins_latna',
                  'label',
                  'Kennitala hins látna',
                )}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingBottom={8}>
              <BasicInput
                name="malsnumer"
                label={fn('malsnumer', 'label', 'Málsnúmer')}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingBottom={3}>
              <BasicInput
                name="kennitala_arftaka"
                format="######-####"
                label={fn('kennitala_arftaka', 'label', 'Kennitala arftaka')}
              />
            </GridColumn>
          </>
        )
        break
      case SjukratryggingarCategories.SJUKRADAGPENINGAR:
      case SjukratryggingarCategories.LYFJAMAL:
      case SjukratryggingarCategories.SAMNINGAR_INNKAUP:
      case SjukratryggingarCategories.ALTHJODAMAL:
      case SjukratryggingarCategories.ONNUR_THJONUSTA:
        fields = (
          <GridColumn span="12/12" paddingBottom={3}>
            <BasicInput
              name="kennitala_thess_sem_malid_vardar"
              format="######-####"
              label={fn(
                'kennitala_thess_sem_malid_vardar',
                'label',
                'Kennitala þess sem málið varðar',
              )}
              requiredMessage={fn(
                'kennitala_thess_sem_malid_vardar',
                'requiredMessage',
                'Kennitölu vantar',
              )}
            />
          </GridColumn>
        )
        break
      case SjukratryggingarCategories.SLYSAMAL_SJUKLINGATRYGGING:
      case SjukratryggingarCategories.HJALPARTAEKI_NAERING:
      case SjukratryggingarCategories.HEILBRIGDISTHJONUSTA:
        fields = (
          <>
            <GridColumn paddingBottom={3}>
              <BasicInput
                name="kennitala_thess_sem_malid_vardar"
                format="######-####"
                label={fn(
                  'kennitala_thess_sem_malid_vardar',
                  'label',
                  'Kennitala þess sem málið varðar',
                )}
                requiredMessage={fn(
                  'kennitala_thess_sem_malid_vardar',
                  'requiredMessage',
                  'Kennitölu vantar',
                )}
              />
            </GridColumn>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="malsnumer"
                label={fn(
                  'malsnumer_ef_til_stadar',
                  'label',
                  'Málsnúmer (ef til staðar)',
                )}
              />
            </GridColumn>
          </>
        )
        break
      case FiskistofaCategories.FISKVEIDAR:
      case FiskistofaCategories.VEIDIHEIMILDIR:
      case FiskistofaCategories.VEIDILEYFI:
        fields = (
          <GridColumn paddingBottom={3}>
            <BasicInput
              name="skipaskrarnumer"
              label={fn('skipaskrarnumer', 'label', 'Skipaskrárnúmer')}
            />
          </GridColumn>
        )
        break
      case VinnueftirlitidCategories.NAMSKEID:
      case VinnueftirlitidCategories.VINNUSLYS:
      case VinnueftirlitidCategories.VINNUVELARETTINDI:
      case VinnueftirlitidCategories.VINNUVERND:
      case VinnueftirlitidCategories.MARKADSEFTIRLIT:
      case VinnueftirlitidCategories.EKKO_OG_SAMSKIPTI:
      case VinnueftirlitidCategories.LOG_OG_REGLUGERDIR:
      case VinnueftirlitidCategories.LEYFI_OG_UMSAGNIR:
      case VinnueftirlitidCategories.ONNUR_THJONUSTA:
        fields = (
          <GridColumn paddingBottom={3}>
            <BasicCheckbox
              name="oska_eftir_vernd_uppljostrara"
              label={fn(
                'oska_eftir_vernd_uppljostrara',
                'label',
                'Óska eftir vernd uppljóstrara',
              )}
            />
          </GridColumn>
        )
        break
      case VinnueftirlitidCategories.SKRANING_OG_SKODUN_VINNUVELA:
        fields = (
          <>
            <GridColumn paddingBottom={3}>
              <BasicCheckbox
                name="oska_eftir_vernd_uppljostrara"
                label={fn(
                  'oska_eftir_vernd_uppljostrara',
                  'label',
                  'Óska eftir vernd uppljóstrara',
                )}
              />
            </GridColumn>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="vinnuvelanumer_kaupanda"
                label={fn(
                  'vinnuvelanumer_kaupanda',
                  'label',
                  'Vinnuvélanúmer kaupanda',
                )}
              />
            </GridColumn>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="vinnuvelanumer_seljanda"
                label={fn(
                  'vinnuvelanumer_seljanda',
                  'label',
                  'Vinnuvélanúmer seljanda',
                )}
              />
            </GridColumn>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="vinnuvelanumer_vegna_skodunar"
                label={fn(
                  'vinnuvelanumer_vegna_skodunar',
                  'label',
                  'Vinnuvélanúmer vegna skoðunar',
                )}
              />
            </GridColumn>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="stadsetning_taekis"
                label={fn('stadsetning_taekis', 'label', 'Staðsetning tækis')}
              />
            </GridColumn>
          </>
        )
        break
      case VinnueftirlitidCategories.MANNVIRKJAGERD:
        fields = (
          <>
            <GridColumn paddingBottom={3}>
              <BasicCheckbox
                name="oska_eftir_vernd_uppljostrara"
                label={fn(
                  'oska_eftir_vernd_uppljostrara',
                  'label',
                  'Óska eftir vernd uppljóstrara',
                )}
              />
            </GridColumn>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="stadsetning_verkstadar"
                label={fn(
                  'stadsetning_verkstadar',
                  'label',
                  'Staðsetning verkstaðar',
                )}
              />
            </GridColumn>
          </>
        )
        break
      case VinnueftirlitidCategories.VINNUADSTADA:
        fields = (
          <>
            <GridColumn paddingBottom={3}>
              <BasicInput
                name="nafn_fyrirtaekis"
                requiredMessage={fn(
                  'nafn_fyrirtaekis',
                  'requiredMessage',
                  'Nafn fyrirtækis vantar',
                )}
                label={fn('nafn_fyrirtaekis', 'label', 'Nafn fyrirtækis')}
              />
            </GridColumn>
            <GridColumn span="12/12" paddingBottom={3}>
              <BasicInput
                name="starfsstod"
                label={fn('starfsstod', 'label', 'Starfsstöð')}
              />
            </GridColumn>
          </>
        )
        break
      default:
        break
    }

    if (institutionSlugBelongsToMannaudstorg) {
      fields = (
        <GridColumn span="12/12">
          <BasicInput
            label={fn('starfsheiti', 'label', 'Starfsheiti')}
            name="starfsheiti"
            requiredMessage={n('jobTitleMissing', 'Starfsheiti vantar')}
          />
        </GridColumn>
      )
    }

    if (institutionSligBelongsToDirectorateOfImmigration) {
      fields = (
        <>
          <GridColumn span="12/12" paddingBottom={3}>
            <Text>
              {n(
                '',
                activeLocale === 'is'
                  ? 'Til þess að flýta fyrir máttu endilega gefa okkur upp eftirfarandi upplýsingar ef það á við:'
                  : 'In order to speed things up, please provide us with the following information if applicable:',
              )}
            </Text>
          </GridColumn>
          <GridColumn span="12/12" paddingBottom={3}>
            <BasicInput
              name="nafn_malsadila"
              label={fn(
                'nafn_malsadila',
                'label',
                activeLocale === 'is'
                  ? 'Nafn málsaðila'
                  : 'Name of applicant/litigant',
              )}
            />
          </GridColumn>
          <GridColumn span="12/12" paddingBottom={3}>
            <BasicInput
              name="faedingardagur_eda_kennitala_malsadila"
              label={fn(
                'faedingardagur_eda_kennitala_malsadila',
                'label',
                activeLocale === 'is'
                  ? 'Fæðingardagur/Kennitala málsaðila'
                  : 'Date of birth - ID number of the applicant/litigant',
              )}
            />
          </GridColumn>
          <GridColumn span="12/12">
            <BasicInput
              name="malsnumer"
              label={fn('malsnumer', 'label', 'Málsnúmer')}
            />
          </GridColumn>
        </>
      )
    }

    setAddonFields(
      fields ? (
        <GridRow marginBottom={5} marginTop={5}>
          {fields}
        </GridRow>
      ) : null,
    )
  }, [categoryId])

  const canSubmit = !isSubmitting

  const submitWithMessage = async () => {
    const values = getValues()

    let message = ''

    if (categoryLabel) {
      message = `Málaflokkur:\n${categoryLabel}\n\n`
    }

    message = Object.keys(labels)
      .filter((k) => !skippedLabelsInMessage.includes(k))
      .reduce((message, k) => {
        const label = labels[k]
        const value = values[k]

        if (
          label &&
          ((Array.isArray(value) && value.length > 0) ||
            (!Array.isArray(value) && Boolean(value)))
        ) {
          message += `${label}:\n${value}\n\n`
        }

        return message
      }, message)

    // append the comment separately
    if (values?.erindi) {
      message = `${message}\n\n${values.erindi}`
    }

    return onSubmit({
      email: values.email,
      name: values.nafn,
      subject: values.vidfangsefni,
      syslumadur: syslumadurId || '',
      category: categoryId,
      institutionSlug,
      message,
    })
  }

  const isBusy = loadingSuggestions || isChangingSubject

  const categoryOptions = (supportCategories ?? [])
    .map((x) => ({
      label: x.title?.trim(),
      value: x.id,
    }))
    .sort(sortAlpha('label'))

  return (
    <FormProvider {...useFormMethods}>
      <GridContainer>
        <GridRow marginTop={6} marginBottom={4}>
          <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
            <Select
              backgroundColor="blue"
              icon="chevronDown"
              isSearchable
              label={fn('malaflokkur', 'label', 'Málaflokkur')}
              name="malaflokkur"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              onChange={({ label, value }: Option) => {
                setCategoryLabel(label as string)
                setCategoryId(value as string)
              }}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              options={categoryOptions}
              placeholder={fn('malaflokkur', 'placeholder', 'Veldu flokk')}
              size="md"
            />
            <Box marginLeft={1} marginTop={1}>
              <Text variant="small" as="div">
                <i>{categoryDescription}</i>
              </Text>
            </Box>
          </GridColumn>
        </GridRow>

        {categoryId && (
          <GridRow marginTop={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
              <InputController
                backgroundColor="blue"
                control={control}
                id="vidfangsefni"
                name="vidfangsefni"
                label={fn('vidfangsefni', 'label', 'Viðfangsefni')}
                error={errors?.vidfangsefni?.message as string}
                onChange={(e) => {
                  setIsChangingSubject(
                    e?.target?.value?.length > MIN_SEARCH_QUERY_LENGTH,
                  )
                  setSubject(e.target.value)
                }}
                rules={{
                  required: {
                    value: true,
                    message: fn(
                      'vidfangsefni',
                      'requiredMessage',
                      'Vinsamlegast fylltu út viðfangsefni',
                    ),
                  },
                }}
                required
              />
            </GridColumn>
          </GridRow>
        )}

        {(isBusy || !!suggestions.length) && (
          <Box
            marginTop={3}
            borderLeftWidth="standard"
            borderColor="blue200"
            paddingX={3}
            paddingY={3}
          >
            {!!suggestions.length && (
              <Text variant="h5" marginBottom={3}>
                {n(
                  'weThinkThisMightHelp',
                  activeLocale === 'is'
                    ? 'Við höldum að þetta gæti hjálpað'
                    : 'Related topics',
                )}
              </Text>
            )}
            {isBusy ? (
              <LoadingDots />
            ) : suggestions.length ? (
              <Stack space={2}>
                {suggestions
                  .slice(0, showAllSuggestions ? 10 : 5)
                  .map(({ title, slug, organization, category }, index) => {
                    const organizationSlug = organization?.slug
                    const categorySlug = category?.slug

                    return (
                      <LinkContext.Provider
                        key={index}
                        value={{
                          linkRenderer: (href, children) => (
                            <Link
                              href={href}
                              color="blue600"
                              underline="normal"
                            >
                              {children}
                            </Link>
                          ),
                        }}
                      >
                        <Text key={index} variant="small" color="blue600">
                          <a
                            href={
                              linkResolver('supportqna', [
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore make web strict
                                organizationSlug,
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore make web strict
                                categorySlug,
                                slug,
                              ]).href
                            }
                          >
                            {title}
                          </a>
                        </Text>
                      </LinkContext.Provider>
                    )
                  })}
                {suggestions.length > 5 && !showAllSuggestions && (
                  <Button
                    onClick={() => setShowAllSuggestions(true)}
                    variant="text"
                    size="small"
                    icon="arrowDown"
                  >
                    {n(
                      'seeMore',
                      activeLocale === 'is' ? 'Sjá meira' : 'See more',
                    )}
                  </Button>
                )}
              </Stack>
            ) : (
              <Text variant="small">
                {n(
                  'nothingWasFound',
                  activeLocale === 'is' ? 'Ekkert fannst' : 'Nothing was found',
                )}
              </Text>
            )}
          </Box>
        )}

        <GridRow marginBottom={called ? 0 : 20}></GridRow>
      </GridContainer>

      {called && (
        <form onSubmit={handleSubmit(submitWithMessage)}>
          <GridContainer>
            {institutionSlugBelongsToMannaudstorg && (
              <GridRow marginTop={8}>
                <GridColumn
                  paddingBottom={3}
                  span={['12/12', '12/12', '12/12', '8/12']}
                >
                  <Controller
                    control={control}
                    name="rikisadili"
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: fn(
                          'rikisadili',
                          'requiredMessage',
                          'Vinsamlegast veldu stofnun',
                        ),
                      },
                    }}
                    render={({ field: { onChange } }) => (
                      <Select
                        backgroundColor="blue"
                        icon="chevronDown"
                        isSearchable
                        label={fn('rikisadili', 'label', 'Ríkisaðili')}
                        name="rikisadili"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        onChange={({ label }: Option) => {
                          onChange(label)
                        }}
                        hasError={errors?.rikisadili !== undefined}
                        errorMessage={errors?.rikisadili?.message?.toString()}
                        options={stateEntityOptions}
                        placeholder={fn(
                          'rikisadili',
                          'requiredMessage',
                          'Leitaðu að þinni stofnun',
                        )}
                        size="md"
                        required
                      />
                    )}
                  />
                </GridColumn>
              </GridRow>
            )}
            <GridRow marginTop={institutionSlugBelongsToMannaudstorg ? 5 : 8}>
              <GridColumn
                paddingBottom={3}
                span={['12/12', '12/12', '12/12', '8/12']}
              >
                <Controller
                  control={control}
                  name="nafn"
                  defaultValue=""
                  rules={{
                    required: {
                      value: true,
                      message: fn('nafn', 'requiredMessage', 'Nafn vantar'),
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <Input
                      backgroundColor="blue"
                      name={name}
                      onBlur={onBlur}
                      label={fn('nafn', 'label', 'Nafn')}
                      value={value}
                      hasError={errors?.nafn !== undefined}
                      errorMessage={errors?.nafn?.message as string}
                      onChange={onChange}
                      required
                    />
                  )}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
                <GridRow>
                  <GridColumn paddingBottom={3} span="12/12">
                    <Controller
                      control={useFormMethods.control}
                      name="email"
                      defaultValue=""
                      rules={{
                        required: {
                          value: true,
                          message: fn(
                            'email',
                            'requiredMessage',
                            'Netfang vantar',
                          ),
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: fn(
                            'email',
                            'patternMessage',
                            'Netfang er mögulega rangt skrifað',
                          ),
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value, name },
                      }) => (
                        <Input
                          backgroundColor="blue"
                          name={name}
                          onBlur={onBlur}
                          label={fn('email', 'label', 'Tölvupóstfang')}
                          value={value}
                          hasError={errors?.email !== undefined}
                          errorMessage={errors?.email?.message as string}
                          onChange={onChange}
                          required
                        />
                      )}
                    />
                  </GridColumn>
                </GridRow>
                {addonFields}
                <GridRow>
                  <GridColumn span="12/12" paddingTop={5}>
                    <Controller
                      control={control}
                      name="erindi"
                      defaultValue=""
                      rules={{
                        required: {
                          value: true,
                          message: fn(
                            'erindi',
                            'requiredMessage',
                            'Erindi vantar',
                          ),
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value, name },
                      }) => (
                        <Input
                          backgroundColor="blue"
                          name={name}
                          onBlur={onBlur}
                          label={fn('erindi', 'label', 'Erindi')}
                          value={value}
                          hasError={errors?.erindi !== undefined}
                          errorMessage={errors?.erindi?.message as string}
                          onChange={onChange}
                          rows={10}
                          textarea
                          required
                        />
                      )}
                    />
                  </GridColumn>
                </GridRow>
                <GridRow marginTop={8}>
                  <GridColumn
                    span={['12/12', '12/12', '6/12', '6/12']}
                    paddingBottom={3}
                  >
                    {institutionSlug === 'syslumenn' && (
                      <Controller
                        control={control}
                        name="syslumadur"
                        defaultValue=""
                        rules={{
                          required: {
                            value: true,
                            message: fn(
                              'syslumadur',
                              'requiredMessage',
                              'Vinsamlegast veldu sýslumannsembætti',
                            ),
                          },
                        }}
                        render={({ field: { onChange } }) => (
                          <Select
                            backgroundColor="blue"
                            icon="chevronDown"
                            isSearchable
                            label={fn('syslumadur', 'label', 'Þinn sýslumaður')}
                            name="syslumadur"
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            onChange={({ label, value }: Option) => {
                              onChange(label)
                              setSyslumadurId(value)
                            }}
                            hasError={errors?.syslumadur !== undefined}
                            errorMessage={errors?.syslumadur?.message as string}
                            options={(syslumenn ?? []).map((x) => ({
                              label: x.title,
                              value: x.id,
                            }))}
                            placeholder={fn(
                              'syslumadur',
                              'placeholder',
                              'Veldu sýslumannsembætti',
                            )}
                            size="sm"
                            required
                          />
                        )}
                      />
                    )}
                  </GridColumn>
                  <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flexEnd"
                      alignItems="flexEnd"
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        icon="arrowForward"
                        loading={loading}
                        disabled={!canSubmit}
                      >
                        {n(
                          'submitServiceWebForm',
                          activeLocale === 'is'
                            ? 'Senda fyrirspurn'
                            : 'Submit inquiry',
                        )}
                      </Button>
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </form>
      )}
    </FormProvider>
  )
}
