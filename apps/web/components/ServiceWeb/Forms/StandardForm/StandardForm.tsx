import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  useForm,
  Controller,
  ValidationRules,
  useFormContext,
  FormProvider,
} from 'react-hook-form'
import { useDebounce } from 'react-use'
import { FormatInputValueFunction } from 'react-number-format'

import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  Button,
  Option,
  Input,
  Text,
  LinkContext,
  Link,
  Stack,
  LoadingDots,
  Checkbox,
} from '@island.is/island-ui/core'
import { Organizations, SupportCategory } from '@island.is/api/schema'
import { GET_SUPPORT_SEARCH_RESULTS_QUERY } from '@island.is/web/screens/queries'
import {
  ContentLanguage,
  GetSupportSearchResultsQuery,
  GetSupportSearchResultsQueryVariables,
  SearchableContentTypes,
  SearchableTags,
  SupportQna,
} from '@island.is/web/graphql/schema'
import { ModifySearchTerms } from '../../SearchInput/SearchInput'
import orderBy from 'lodash/orderBy'
import { useNamespace } from '@island.is/web/hooks'
import slugify from '@sindresorhus/slugify'
import { FormNamespace } from '../../types'
import { useI18n } from '@island.is/web/i18n'

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

type CategoryId =
  /**
   * Fjölskyldumál
   */
  | '4vQ4htPOAZvzcXBcjx06SH'
  /**
   * Skírteini
   */
  | '7nWhQCER920RakQ7BZpEmV'
  /**
   * Andlát og dánarbú
   */
  | '2TkJynZlamqTHdjUziXDG0'
  /**
   * Þinglýsingar, staðfestingar og skráningar
   */
  | '6K9stHLAB2mEyGqtqjnXxf'
  /**
   * Gjöld og innheimta
   */
  | '5u2M09Kw3p1Spva1GSuAzB'
  /**
   * Löggildingar
   */
  | 'WrQIftmx61sHJMoIr1QRW'
  /**
   * Vottorð
   */
  | '76Expbwtudon1Gz5lrKOit'
  /**
   * Lögráðamál
   */
  | '4tvRkPgKP3kerbyRJDvaWF'
  /**
   * Önnur þjónusta sýslumanna
   */
  | '4LNbNB3GvH3RcoIGpuZKhG'
  /**
   * Leyfi
   */
  | '7HbSNTUHJReJ2GPeT1ni1C'
  /**
   * Fullnustugerðir
   */
  | '7LkzuYSzqwM7k8fJyeRbm6'

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
}

// these should be skipped in the message itself
const skippedLabelsInMessage: Array<keyof typeof labels> = [
  'nafn',
  'vidfangsefni',
  'erindi',
]

const useFormNamespace = (namespace: FormNamespace) => (
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
  const { errors, register } = useFormContext()

  return (
    <InputController
      backgroundColor="blue"
      id={name}
      name={name}
      label={label}
      error={errors?.[name]?.message}
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
      {...register(name)}
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
  const useFormMethods = useForm({})
  const n = useNamespace(namespace)
  const fn = useFormNamespace(formNamespace)
  const {
    handleSubmit,
    getValues,
    control,
    errors,
    formState: { isSubmitting },
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
    () => supportCategories.find((c) => c.id === categoryId)?.description ?? '',
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
    onCompleted: () => {
      setIsChangingSubject(false)
      updateSuggestions()
    },
  })

  const institutionSlugBelongsToMannaudstorg = institutionSlug.includes(
    'mannaudstorg',
  )

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
                tags: institutionSlugBelongsToMannaudstorg
                  ? [
                      {
                        key: 'mannaudstorg',
                        type: SearchableTags.Organization,
                      },
                    ]
                  : [],
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

  const updateSuggestions = () => {
    setSuggestions((data?.searchResults?.items as Array<SupportQna>) || [])
  }

  useEffect(() => {
    let fields = null

    switch (categoryId as CategoryId) {
      case '6K9stHLAB2mEyGqtqjnXxf':
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
      case '7HbSNTUHJReJ2GPeT1ni1C':
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
      case '5u2M09Kw3p1Spva1GSuAzB':
      case '7nWhQCER920RakQ7BZpEmV':
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
      case '7LkzuYSzqwM7k8fJyeRbm6':
      case '4tvRkPgKP3kerbyRJDvaWF':
      case '4vQ4htPOAZvzcXBcjx06SH':
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
      case '2TkJynZlamqTHdjUziXDG0':
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
      default:
        break
    }

    if (institutionSlugBelongsToMannaudstorg) {
      fields = (
        <GridColumn span="12/12">
          <BasicInput name="starfsheiti" requiredMessage="Starfsheiti vantar" />
        </GridColumn>
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

        if (label && value) {
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

  return (
    <>
      <GridContainer>
        <GridRow marginTop={6} marginBottom={4}>
          <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
            <Select
              backgroundColor="blue"
              icon="chevronDown"
              isSearchable
              label={fn('malaflokkur', 'label', 'Málaflokkur')}
              name="malaflokkur"
              onChange={({ label, value }: Option) => {
                setCategoryLabel(label as string)
                setCategoryId(value as string)
              }}
              options={orderBy(supportCategories, 'title', 'asc').map((x) => ({
                label: x.title,
                value: x.id,
              }))}
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
                error={errors?.vidfangsefni?.message}
                onChange={(e) => {
                  if (e?.target?.value?.length > MIN_SEARCH_QUERY_LENGTH) {
                    setIsChangingSubject(true)
                  }
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
                {n('weThinkThisMightHelp', 'Við höldum að þetta gæti hjálpað')}
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
                            href={`${
                              linkResolver('supportcategory', [
                                organizationSlug,
                                categorySlug,
                                slug,
                              ]).href
                            }?q=${slug}`}
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
                    {n('seeMore', 'Sjá meira')}
                  </Button>
                )}
              </Stack>
            ) : (
              <Text variant="small">
                {n('nothingWasFound', 'Ekkert fannst')}
              </Text>
            )}
          </Box>
        )}

        <GridRow marginBottom={called ? 0 : 20}></GridRow>
      </GridContainer>

      {called && (
        <FormProvider {...useFormMethods}>
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
                      id="rikisadili"
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
                      render={({ onChange }) => (
                        <Select
                          backgroundColor="blue"
                          icon="chevronDown"
                          isSearchable
                          label={fn('rikisadili', 'label', 'Ríkisaðili')}
                          name="rikisadili"
                          onChange={({ label }: Option) => {
                            onChange(label)
                          }}
                          hasError={errors.rikisadili}
                          errorMessage={errors.rikisadili?.message}
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
                    rules={
                      {
                        required: {
                          value: true,
                          message: fn('nafn', 'requiredMessage', 'Nafn vantar'),
                        },
                      } as ValidationRules
                    }
                    render={({ onChange, onBlur, value, name }) => (
                      <Input
                        backgroundColor="blue"
                        name={name}
                        onBlur={onBlur}
                        label={fn('nafn', 'label', 'Nafn')}
                        value={value}
                        hasError={errors.nafn}
                        errorMessage={errors.nafn?.message}
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
                        id="email"
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
                        render={({ onChange, onBlur, value, name }) => (
                          <Input
                            backgroundColor="blue"
                            name={name}
                            onBlur={onBlur}
                            label={fn('email', 'label', 'Tölvupóstfang')}
                            value={value}
                            hasError={errors.email}
                            errorMessage={errors.email?.message}
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
                        id="erindi"
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
                        render={({ onChange, onBlur, value, name }) => (
                          <Input
                            backgroundColor="blue"
                            name={name}
                            onBlur={onBlur}
                            label={fn('erindi', 'label', 'Erindi')}
                            value={value}
                            hasError={errors.erindi}
                            errorMessage={errors.erindi?.message}
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
                    <GridColumn>
                      <Controller
                        name="storageAllowed"
                        defaultValue={false}
                        control={control}
                        rules={{ required: true }}
                        render={(props) => (
                          <Checkbox
                            label={n(
                              'serviceWebFormStorageAllowedCheckboxText',
                              'Ég gef leyfi fyrir því að erindi mitt sé vistað í póstumsjónarkerfi',
                            )}
                            checked={props.value}
                            onChange={(e) => props.onChange(e.target.checked)}
                            hasError={errors.storageAllowed}
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
                          id="syslumadur"
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
                          render={({ onChange }) => (
                            <Select
                              backgroundColor="blue"
                              icon="chevronDown"
                              isSearchable
                              label={fn(
                                'syslumadur',
                                'label',
                                'Þinn sýslumaður',
                              )}
                              name="syslumadur"
                              onChange={({ label, value }: Option) => {
                                onChange(label)
                                setSyslumadurId(value as string)
                              }}
                              hasError={errors.syslumadur}
                              errorMessage={errors.syslumadur?.message}
                              options={syslumenn.map((x) => ({
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
                          {n('submitServiceWebForm', 'Senda fyrirspurn')}
                        </Button>
                      </Box>
                    </GridColumn>
                  </GridRow>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </form>
        </FormProvider>
      )}
    </>
  )
}
