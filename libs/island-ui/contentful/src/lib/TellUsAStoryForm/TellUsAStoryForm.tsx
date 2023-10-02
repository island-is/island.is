import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Document } from '@contentful/rich-text-types'
import gql from 'graphql-tag'
import { useForm, Controller } from 'react-hook-form'
import {
  Text,
  Box,
  Input,
  ButtonDeprecated as Button,
  Select,
  DatePicker,
  Stack,
  Checkbox,
  GridRow,
  GridColumn,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'

import BackgroundImage from '../BackgroundImage/BackgroundImage'
import { Slice as SliceType, richText } from '../..'
import * as styles from './TellUsAStoryFrom.css'

export const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        title
      }
    }
  }
`

export interface TellUsAStoryFormState {
  organization: string
  dateOfStory: string
  subject?: string
  message: string
  name: string
  email: string
  publicationAllowed: boolean
}

type FormState = 'edit' | 'submitting' | 'error' | 'success'
type DocumentType = {
  __typename: 'Html'
  id: string
  document: Document | { [key: string]: Document }
}

export interface TellUsAStoryFormProps {
  introTitle: string
  introImage?: { url: string; title: string }
  introDescription?: DocumentType
  instructionsDescription?: DocumentType
  instructionsTitle: string
  firstSectionTitle: string
  organizationLabel: string
  organizationPlaceholder: string
  organizationInputErrorMessage: string
  dateOfStoryLabel: string
  dateOfStoryPlaceholder: string
  dateOfStoryInputErrorMessage: string
  secondSectionTitle: string
  subjectLabel: string
  subjectPlaceholder: string
  subjectInputErrorMessage?: string
  messageLabel: string
  messagePlaceholder: string
  messageInputErrorMessage: string
  thirdSectionTitle: string
  instructionsImage: { url: string; title: string }
  nameLabel: string
  namePlaceholder: string
  nameInputErrorMessage: string
  emailLabel: string
  emailPlaceholder: string
  emailInputErrorMessage: string
  publicationAllowedLabel: string
  submitButtonTitle: string
  SuccessMessageTitle: string
  tellUsAStorySuccessMessage?: DocumentType
  errorMessageTitle: string
  locale: string
  state: FormState
  showIntro?: boolean
  onSubmit: (formState: TellUsAStoryFormState) => Promise<void>
}

export const TellUsAStoryForm: React.FC<
  React.PropsWithChildren<TellUsAStoryFormProps>
> = ({
  introTitle,
  introImage,
  introDescription,
  instructionsImage,
  instructionsTitle,
  instructionsDescription,
  showIntro = true,
  SuccessMessageTitle,
  publicationAllowedLabel,
  tellUsAStorySuccessMessage,
  emailLabel,
  errorMessageTitle,
  submitButtonTitle,
  emailPlaceholder,
  emailInputErrorMessage,
  namePlaceholder,
  nameLabel,
  nameInputErrorMessage,
  thirdSectionTitle,
  secondSectionTitle,
  firstSectionTitle,
  subjectLabel,
  subjectPlaceholder,
  organizationLabel,
  organizationPlaceholder,
  organizationInputErrorMessage,
  dateOfStoryLabel,
  dateOfStoryPlaceholder,
  dateOfStoryInputErrorMessage,
  messageLabel,
  messagePlaceholder,
  messageInputErrorMessage,
  state = 'edit',
  locale = 'is',
  onSubmit,
}) => {
  const methods = useForm()
  const { data, loading, error } = useQuery(GET_ORGANIZATIONS_QUERY, {
    variables: {
      input: {
        lang: locale,
      },
    },
  })

  const { width } = useWindowSize()
  const [isTablet, setIsTablet] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsTablet(true)
    }
    setIsTablet(false)
  }, [width])

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (state === 'error') {
      toast.error(errorMessageTitle)
    }
  }, [state, errorMessageTitle])

  const options =
    !error && !loading && data?.getOrganizations?.items?.length
      ? data.getOrganizations.items.map((x: { title: string }) => ({
          label: x.title,
          value: x.title,
        }))
      : []

  return (
    <>
      {!!showIntro && (
        <Box paddingX={[3, 3, 8]} paddingBottom={8}>
          <GridRow>
            <GridColumn span={'12/12'} paddingBottom={[2, 2, 4]}>
              <Text as="h1" variant="h1" lineHeight={'lg'}>
                {introTitle}
              </Text>
              {introDescription && (
                <Box>{richText([introDescription] as SliceType[])}</Box>
              )}
            </GridColumn>
            {!!introImage && (
              <GridColumn
                hiddenBelow="lg"
                span={['0', '0', '0', '3/12']}
                className={styles.infoImageWrapper}
              >
                <Box
                  className={styles.infoImage}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="full"
                  width="full"
                >
                  <BackgroundImage
                    ratio="1:1"
                    background="transparent"
                    image={introImage}
                  />
                </Box>
              </GridColumn>
            )}
          </GridRow>
        </Box>
      )}
      <Box
        paddingY={[3, 3, 8]}
        paddingX={showIntro ? [3, 3, 8] : [3, 3, 3, 3, 15]}
        borderRadius="large"
        background="blue100"
      >
        {state !== 'success' ? (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack space={5}>
              <GridRow>
                <GridColumn span={'12/12'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {firstSectionTitle}
                  </Text>
                </GridColumn>
                <GridColumn span="12/12" paddingBottom={3}>
                  <Controller
                    name="organization"
                    defaultValue={''}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange } }) => (
                      <Select
                        name="organization"
                        label={organizationLabel}
                        placeholder={organizationPlaceholder}
                        options={options}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        errorMessage={
                          errors?.organization
                            ? organizationInputErrorMessage
                            : null
                        }
                        required
                        hasError={errors?.organization !== undefined}
                        isDisabled={
                          Boolean(error || loading) || state === 'submitting'
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        onChange={({ value }) => {
                          onChange(value)
                        }}
                      />
                    )}
                  />
                </GridColumn>
                <GridColumn span="12/12" paddingBottom={3}>
                  <Controller
                    name="dateOfStory"
                    defaultValue={false}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label={dateOfStoryLabel}
                        placeholderText={dateOfStoryPlaceholder}
                        locale={locale as Locale}
                        selected={value}
                        required
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        errorMessage={
                          errors.dateOfStory
                            ? dateOfStoryInputErrorMessage
                            : null
                        }
                        hasError={errors?.dateOfStory !== undefined}
                        disabled={state === 'submitting'}
                        handleChange={onChange}
                      />
                    )}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'12/12'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {secondSectionTitle}
                  </Text>
                </GridColumn>
                <GridColumn span="12/12" paddingBottom={3}>
                  <GridRow>
                    {!!instructionsImage && (
                      <GridColumn
                        span={['0', '3/12', '4/12']}
                        className={styles.alignSelfCenter}
                        hiddenBelow="sm"
                      >
                        <Box className={styles.contentImage}>
                          <BackgroundImage
                            ratio="1:1"
                            background="transparent"
                            image={instructionsImage}
                          />
                        </Box>
                      </GridColumn>
                    )}
                    <GridColumn
                      span={['12/12', '7/12', '8/12']}
                      className={styles.alignSelfCenter}
                    >
                      <Text
                        as="h4"
                        variant="h4"
                        color="blue600"
                        paddingBottom={1}
                      >
                        {instructionsTitle}
                      </Text>
                      {instructionsDescription && (
                        <Box>
                          {richText([instructionsDescription] as SliceType[])}
                        </Box>
                      )}
                    </GridColumn>
                  </GridRow>
                </GridColumn>
                <GridColumn span="12/12">
                  <Stack space={3}>
                    <Input
                      label={subjectLabel}
                      placeholder={subjectPlaceholder}
                      defaultValue=""
                      disabled={state === 'submitting'}
                      {...register('subject', {
                        required: false,
                      })}
                    />
                    <Input
                      label={messageLabel}
                      placeholder={messagePlaceholder}
                      defaultValue=""
                      textarea
                      rows={isTablet ? 8 : showIntro ? 14 : 18}
                      required
                      errorMessage={errors?.message?.message as string}
                      disabled={state === 'submitting'}
                      {...register('message', {
                        required: messageInputErrorMessage,
                      })}
                    />
                  </Stack>
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'12/12'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {thirdSectionTitle}
                  </Text>
                </GridColumn>
                <GridColumn span="12/12" paddingBottom={3}>
                  <Input
                    label={nameLabel}
                    placeholder={namePlaceholder}
                    defaultValue=""
                    required
                    errorMessage={errors?.name?.message as string}
                    disabled={state === 'submitting'}
                    {...register('name', {
                      required: nameInputErrorMessage,
                    })}
                  />
                </GridColumn>

                <GridColumn span="12/12">
                  <Input
                    label={emailLabel}
                    placeholder={emailPlaceholder}
                    defaultValue=""
                    required
                    errorMessage={errors?.email?.message as string}
                    disabled={state === 'submitting'}
                    {...register('email', {
                      required: emailInputErrorMessage,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: emailInputErrorMessage,
                      },
                    })}
                  />
                </GridColumn>
              </GridRow>

              <Controller
                name="publicationAllowed"
                defaultValue={false}
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    label={publicationAllowedLabel}
                    checked={value}
                    disabled={state === 'submitting'}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <GridRow>
                <GridColumn span={'12/12'}>
                  <Box className={styles.justifyContentFlexEnd}>
                    <Button htmlType="submit" loading={state === 'submitting'}>
                      {submitButtonTitle}
                    </Button>
                  </Box>
                </GridColumn>
              </GridRow>
            </Stack>
          </form>
        ) : (
          <Box paddingTop={[2, 4, 6, 12]} paddingBottom={[3, 6, 8, 20]}>
            <Text variant="h2" as="h2" paddingBottom={2}>
              {SuccessMessageTitle}
            </Text>
            {tellUsAStorySuccessMessage && (
              <Box paddingBottom={3}>
                {richText([tellUsAStorySuccessMessage] as SliceType[])}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <ToastContainer
        hideProgressBar={true}
        closeButton={true}
        useKeyframeStyles={false}
      />
    </>
  )
}

export default TellUsAStoryForm
