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
  Option,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'
import BackgroundImage from '../BackgroundImage/BackgroundImage'
import { renderHtml } from '../richTextRendering'

import * as styles from './TellUsAStoryFrom.treat'

type Locale = 'is' | 'pl'

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
  typename: string
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
  successMessage?: DocumentType
  errorMessageTitle?: string
  locale: string
  state: FormState
  showIntro?: boolean
  onSubmit: (formState: TellUsAStoryFormState) => Promise<void>
}

export const TellUsAStoryForm: React.FC<TellUsAStoryFormProps> = ({
  introTitle,
  introImage,
  introDescription,
  instructionsImage,
  instructionsTitle,
  instructionsDescription,
  showIntro = true,
  SuccessMessageTitle,
  publicationAllowedLabel,
  successMessage,
  emailLabel,
  errorMessageTitle,
  submitButtonTitle,
  emailPlaceholder,
  emailInputErrorMessage,
  namePlaceholder,
  nameLabel,
  nameInputErrorMessage,
  thirdSectionTitle,
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

  const { handleSubmit, register, control, errors } = methods

  useEffect(() => {
    if (state === 'error') {
      toast.error(errorMessageTitle)
    }
  }, [state, errorMessageTitle])

  const options =
    !error && !loading && data?.getOrganizations?.items?.length
      ? data.getOrganizations.items.map((x) => ({
          label: x.title,
          value: x.title,
        }))
      : []

  return (
    <>
      {!!showIntro && (
        <Box paddingBottom={8}>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '0', '1/9']}
              span={['12/12', '12/12', '12/12', '7/12']}
              paddingBottom={[2, 2, 4]}
            >
              <Text as="h1" variant="h1" lineHeight={'lg'}>
                {introTitle}
              </Text>
              {introDescription && (
                <Box>{renderHtml(introDescription.document as Document)}</Box>
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
                  <BackgroundImage ratio="1:1" image={introImage} />
                </Box>
              </GridColumn>
            )}
          </GridRow>
        </Box>
      )}
      <Box padding={[3, 3, 8]} borderRadius="large" background="blue100">
        {state !== 'success' ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack space={5}>
              <GridRow>
                <GridColumn span={'10/10'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {firstSectionTitle}
                  </Text>
                </GridColumn>
                <GridColumn span={['10/10', '10/10', '10/10', '10/10', '5/10']}>
                  <Controller
                    name="organization"
                    defaultValue={''}
                    control={control}
                    rules={{ required: false }}
                    render={({ onChange }) => (
                      <Select
                        name="organization"
                        label={organizationLabel}
                        placeholder={organizationPlaceholder}
                        options={options}
                        errorMessage={
                          errors.organization
                            ? organizationInputErrorMessage
                            : null
                        }
                        hasError={errors.organization}
                        disabled={
                          Boolean(error || loading) || state === 'submitting'
                        }
                        onChange={({ value }: Option) => {
                          onChange(value)
                        }}
                      />
                    )}
                  />
                </GridColumn>
                <GridColumn
                  span={['10/10', '10/10', '10/10', '10/10', '5/10']}
                  paddingTop={[3, 3, 3, 3, 0]}
                >
                  <Controller
                    name="dateOfStory"
                    defaultValue={false}
                    control={control}
                    rules={{ required: true }}
                    render={({ onChange, value }) => (
                      <DatePicker
                        label={dateOfStoryLabel}
                        placeholderText={dateOfStoryPlaceholder}
                        locale={
                          ['is', 'pl'].indexOf(locale) > 0
                            ? (locale as Locale)
                            : null
                        }
                        selected={value}
                        required
                        errorMessage={
                          errors.dateOfStory
                            ? dateOfStoryInputErrorMessage
                            : null
                        }
                        hasError={errors.dateOfStory}
                        disabled={state === 'submitting'}
                        handleChange={onChange}
                      />
                    )}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'10/10'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {'Sagan'}
                  </Text>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
                  <GridRow>
                    <GridColumn span={'12/12'}>
                      <Stack space={3}>
                        <Input
                          name="subject"
                          label={subjectLabel}
                          placeholder={subjectPlaceholder}
                          defaultValue=""
                          disabled={state === 'submitting'}
                          ref={register({
                            required: false,
                          })}
                        />
                        <Input
                          name="message"
                          label={messageLabel}
                          placeholder={messagePlaceholder}
                          defaultValue=""
                          textarea
                          rows={8}
                          required
                          errorMessage={errors.message?.message}
                          disabled={state === 'submitting'}
                          ref={register({
                            required: messageInputErrorMessage,
                          })}
                        />
                      </Stack>
                    </GridColumn>
                  </GridRow>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '12/12', '4/12']}
                  offset={[null, null, null, '1/12']}
                  paddingTop={[4, 4, 4, 0]}
                  paddingBottom={3}
                >
                  <GridRow>
                    {!!instructionsImage && (
                      <GridColumn
                        span={['5/12', '4/12', '5/12', '12/12', '12/12']}
                        className={styles.alignSelfCenter}
                        paddingBottom={2}
                      >
                        <Box className={styles.contentImage}>
                          <BackgroundImage
                            ratio="1:1"
                            image={instructionsImage}
                          />
                        </Box>
                      </GridColumn>
                    )}
                    <GridColumn
                      span={['7/12', '8/12', '7/12', '12/12', '12/12']}
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
                          {renderHtml(
                            instructionsDescription.document as Document,
                          )}
                        </Box>
                      )}
                    </GridColumn>
                  </GridRow>
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'12/12'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {thirdSectionTitle}
                  </Text>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '12/12', '12/12', '6/12']}
                  paddingBottom={3}
                >
                  <Input
                    name="name"
                    label={nameLabel}
                    placeholder={namePlaceholder}
                    defaultValue=""
                    required
                    errorMessage={errors.name?.message}
                    disabled={state === 'submitting'}
                    ref={register({
                      required: nameInputErrorMessage,
                    })}
                  />
                </GridColumn>

                <GridColumn
                  span={['12/12', '12/12', '12/12', '12/12', '6/12']}
                  paddingBottom={3}
                >
                  <Input
                    name="email"
                    label={emailLabel}
                    placeholder={emailPlaceholder}
                    defaultValue=""
                    required
                    errorMessage={errors.email?.message}
                    disabled={state === 'submitting'}
                    ref={register({
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
                render={(props) => (
                  <Checkbox
                    label={publicationAllowedLabel}
                    checked={props.value}
                    disabled={state === 'submitting'}
                    onChange={(e) => props.onChange(e.target.checked)}
                  />
                )}
              />
              <GridRow className={styles.justifyContentFlexEnd}>
                <Button htmlType="submit" loading={state === 'submitting'}>
                  {submitButtonTitle}
                </Button>
              </GridRow>
            </Stack>
          </form>
        ) : (
          <Box paddingTop={[2, 4, 6, 12]} paddingBottom={[3, 6, 8, 20]}>
            <Text variant="h2" as="h2" paddingBottom={2}>
              {SuccessMessageTitle}
            </Text>
            {successMessage && (
              <Box paddingBottom={3}>
                {renderHtml(successMessage.document as Document)}
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
