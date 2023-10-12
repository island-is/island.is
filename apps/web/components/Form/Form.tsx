import { useState } from 'react'
import slugify from '@sindresorhus/slugify'
import { useMutation } from '@apollo/client/react'
import gql from 'graphql-tag'
import {
  Box,
  Text,
  Input,
  Select,
  RadioButton,
  Stack,
  Checkbox,
  Button,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  Form as FormType,
  GenericFormMutation,
  GenericFormMutationVariables,
  Mutation,
  MutationCreateUploadUrlArgs,
  PresignedPost,
} from '@island.is/web/graphql/schema'
import { GENERIC_FORM_MUTATION } from '@island.is/web/screens/queries/Form'
import { useNamespace } from '@island.is/web/hooks'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import { isValidNationalId } from '@island.is/web/utils/isValidNationalId'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as styles from './Form.css'

const CREATE_UPLOAD_URL = gql`
  mutation CreateUploadUrl($filename: String!) {
    createUploadUrl(filename: $filename) {
      url
      fields
    }
  }
`

export enum FormFieldType {
  CHECKBOXES = 'checkboxes',
  INPUT = 'input',
  EMAIL = 'email',
  ACCEPT_TERMS = 'acceptTerms',
  FILE = 'file',
  NATIONAL_ID = 'nationalId (kennitala)',
  INFORMATION = 'information',
  TEXT = 'text',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
}

interface FormFieldProps {
  field: FormType['fields'][0]
  slug: string
  value: string
  error?: string
  onChange: (field: string, value: string) => void
}

interface FormProps {
  form: FormType
  namespace: Record<string, string>
}

export const FormField = ({
  field,
  slug,
  value,
  error,
  onChange,
}: FormFieldProps) => {
  switch (field.type) {
    case FormFieldType.INPUT:
    case FormFieldType.EMAIL:
    case FormFieldType.NATIONAL_ID:
      return (
        <Input
          key={slug}
          placeholder={field.placeholder}
          name={slug}
          label={field.title}
          required={field.required}
          hasError={!!error}
          errorMessage={error}
          value={value}
          onChange={(e) => onChange(slug, e.target.value)}
        />
      )
    case FormFieldType.TEXT:
      return (
        <Input
          key={slug}
          placeholder={field.placeholder}
          name={field.title}
          rows={8}
          label={field.title}
          required={field.required}
          textarea
          hasError={!!error}
          errorMessage={error}
          value={value}
          onChange={(e) => onChange(slug, e.target.value)}
        />
      )
    case FormFieldType.DROPDOWN: {
      const options = field.options.map((option) => ({
        label: option,
        value: option,
      }))
      return (
        <Select
          key={slug}
          name={field.title}
          label={field.title}
          placeholder={field.placeholder}
          required={field.required}
          options={options}
          value={
            options.find((o) => o.value === value) ?? { label: value, value }
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          onChange={({ value }: Option) => onChange(slug, value as string)}
          hasError={!!error}
          errorMessage={error}
        />
      )
    }
    case FormFieldType.RADIO:
      return (
        <Box>
          <Text variant="h5" color="blue600">
            {field.title}
            {field.required && (
              <span aria-hidden="true" className={styles.isRequiredStar}>
                *
              </span>
            )}
          </Text>
          {!!error && (
            <Text variant="eyebrow" color="red600" marginY={2}>
              {error}
            </Text>
          )}
          <Text marginY={2}>{field.placeholder}</Text>
          <Stack space={2}>
            {field.options.map((option, idx) => (
              <RadioButton
                key={idx}
                name={`${slug}-${idx}`}
                label={option}
                checked={option === value}
                onChange={() => onChange(slug, option)}
              />
            ))}
          </Stack>
        </Box>
      )
    case FormFieldType.ACCEPT_TERMS:
      return (
        <Stack space={2}>
          <Text variant="h5" color="blue600">
            {field.title}
            {field.required && (
              <span aria-hidden="true" className={styles.isRequiredStar}>
                *
              </span>
            )}
          </Text>
          {!!error && (
            <Text variant="eyebrow" color="red600">
              {error}
            </Text>
          )}
          <Checkbox
            label={field.placeholder}
            checked={value === 'true'}
            onChange={(e) =>
              onChange(slug, e.target.checked ? 'true' : 'false')
            }
          />
        </Stack>
      )
    case FormFieldType.CHECKBOXES:
      return (
        <Stack space={2}>
          <Text variant="h5" color="blue600">
            {field.title}
            {field.required && (
              <span aria-hidden="true" className={styles.isRequiredStar}>
                *
              </span>
            )}
          </Text>
          {field.options.map((option, idx) => {
            const fieldValue = value ? JSON.parse(value)[option] : 'false'
            return (
              <Checkbox
                key={idx}
                label={option}
                checked={fieldValue === 'true'}
                onChange={(e) =>
                  onChange(option, e.target.checked ? 'true' : 'false')
                }
                hasError={!!error}
              />
            )
          })}
        </Stack>
      )
    case FormFieldType.INFORMATION:
      return <Text>{field.informationText}</Text>
    default:
      return null
  }
}

type ErrorData = {
  field: string
  error?: string
}

export const Form = ({ form, namespace }: FormProps) => {
  const n = useNamespace(namespace)
  const defaultNamespace = form.defaultFieldNamespace

  const defaultNameFieldIsShown = defaultNamespace?.displayNameField ?? true
  const defaultEmailFieldIsShown = defaultNamespace?.displayEmailField ?? true

  const [data, setData] = useState<Record<string, string>>(() => {
    const fields = form.fields
      .filter((field) => field.type !== FormFieldType.INFORMATION)
      .map((field): [string, string] => [slugify(field.title), ''])
      .concat([])

    if (defaultNameFieldIsShown) {
      fields.push(['name', ''])
    }

    if (defaultEmailFieldIsShown) {
      fields.push(['email', ''])
    }

    return Object.fromEntries(fields)
  })
  const [fileList, setFileList] = useState<Record<string, UploadFile[]>>(() =>
    Object.fromEntries(
      form.fields
        .filter((field) => field.type === FormFieldType.FILE)
        .map((field) => [slugify(field.title), []]),
    ),
  )
  const [errors, setErrors] = useState<ErrorData[]>([])
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<boolean>(false)

  const [submit, { data: result, error }] = useMutation<
    GenericFormMutation,
    GenericFormMutationVariables
  >(GENERIC_FORM_MUTATION)

  const [createUploadUrl] = useMutation<Mutation, MutationCreateUploadUrlArgs>(
    CREATE_UPLOAD_URL,
  )

  const onChange = (field: string, value: string) => {
    setData({ ...data, [field]: String(value) })
  }

  const validate = () => {
    const err = Object.keys(data)
      .map((slug) => {
        const field = form.fields.find((f) => slugify(f.title) === slug)

        // Handle name and email
        if (!field) {
          if (slug === 'name' && !data['name']) {
            return {
              field: slug,
              error: n('formInvalidName', 'Þennan reit þarf að fylla út.'),
            }
          }

          if (slug === 'email' && !isValidEmail.test(data['email'])) {
            return {
              field: slug,
              error: n('formInvalidEmail', 'Þetta er ekki gilt netfang.'),
            }
          }

          return null
        }

        if (!field.required) {
          return null
        }

        if (
          field.type === FormFieldType.EMAIL &&
          !isValidEmail.test(data[slug])
        ) {
          return {
            field: slug,
            error: n('formInvalidEmail', 'Þetta er ekki gilt netfang.'),
          }
        }

        if (
          field.type === FormFieldType.NATIONAL_ID &&
          !isValidNationalId(data[slug])
        ) {
          return {
            field: slug,
            error: n('formInvalidNationalId', 'Þetta er ekki gild kennitala.'),
          }
        }

        if (
          (field.type !== FormFieldType.FILE &&
            field.required &&
            !data[slug]) ||
          (field.type === FormFieldType.ACCEPT_TERMS && data[slug] !== 'true')
        ) {
          return {
            field: slug,
            error: n('formInvalidName', 'Þennan reit þarf að fylla út.'),
          }
        }

        if (
          field.type === FormFieldType.CHECKBOXES &&
          data[slug] &&
          field.required &&
          !Object.values(JSON.parse(data[slug])).some((v) => v === 'true')
        ) {
          return {
            field: slug,
            error: n('formInvalidName', 'Þennan reit þarf að fylla út.'),
          }
        }

        if (
          field.type === FormFieldType.FILE &&
          field.required &&
          fileList[slug].length === 0
        ) {
          return {
            field: slug,
            error: n('formInvalidName', 'Þennan reit þarf að fylla út.'),
          }
        }

        return null
      })
      .filter((x) => !!x)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    setErrors(err)

    return !err.length
  }

  const formatBody = (data: Record<string, string>) => {
    let firstLine = ''

    if (data['name']) {
      firstLine += `Sendandi: ${data['name']}`
      if (data['email']) {
        firstLine += `<${data['email']}`
      }
      firstLine += '\n\n'
    } else if (data['email']) {
      firstLine += `Sendandi: <${data['email']}>\n\n`
    }

    return firstLine.concat(
      form.fields
        .filter((field) => field.type !== FormFieldType.INFORMATION)
        .map((field) => {
          const value = data[slugify(field.title)]
          if (field.type === FormFieldType.ACCEPT_TERMS) {
            return `${field.title}\nSvar: ${
              value === 'true'
                ? 'Já'
                : value === 'false'
                ? 'Nei'
                : 'Ekkert svar'
            }\n\n`
          }
          if (field.type === FormFieldType.CHECKBOXES) {
            const json = JSON.parse(value)
            return `${field.title}\nSvar:\n\t${Object.entries(json)
              .map(([k, v]) => `${k}: ${v === 'true' ? 'Já' : 'Nei'}`)
              .join('\n\t')}\n\n`
          }
          if (field.type === FormFieldType.FILE) {
            const json: string[] = JSON.parse(value || '[]')
            return `${field.title}\nSvar: ${
              json.join(', ') ?? 'Ekkert svar'
            }\n\n`
          }

          return `${field.title}\nSvar: ${value ?? 'Ekkert svar'}\n\n`
        })
        .join(''),
    )
  }

  /** Returns the value for the form field that decides what email the form will be sent to */
  const getRecipientFormFieldDeciderValue = (): string | undefined => {
    if (!form?.recipientFormFieldDecider?.title) return undefined
    return data[slugify(form.recipientFormFieldDecider.title)]
  }

  const uploadFile = async (
    file: UploadFile,
    response: PresignedPost,
    fieldSlug: string,
  ) => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.withCredentials = true
      request.responseType = 'json'

      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          file.percent = (event.loaded / event.total) * 100
          file.status = 'uploading'

          setFileList({
            ...fileList,
            [fieldSlug]: [
              ...fileList[fieldSlug].filter((f) => f.key !== file.key),
              file,
            ],
          })
        }
      })

      request.upload.addEventListener('error', () => {
        file.percent = 0
        file.status = 'error'

        setFileList({
          ...fileList,
          [fieldSlug]: [
            ...fileList[fieldSlug].filter((f) => f.key !== file.key),
            file,
          ],
        })
        reject()
      })

      request.open('POST', response.url)

      const formData = new FormData()
      Object.keys(response.fields).forEach((key) =>
        formData.append(key, response.fields[key]),
      )
      formData.append('file', file as File)

      request.setRequestHeader('x-amz-acl', 'bucket-owner-full-control')

      request.onload = () => {
        resolve(request.response)
      }
      request.onerror = () => {
        reject()
      }

      request.send(formData)
    })
  }

  const onSubmit = async () => {
    const valid = validate()

    try {
      if (valid) {
        setSubmitting(true)
        const files = await Promise.all(
          form.fields
            .filter((field) => field.type === FormFieldType.FILE)
            .map((field) => {
              return new Promise((resolve, reject) => {
                Promise.all(
                  fileList[slugify(field.title)].map((file) => {
                    return new Promise((resolve, reject) => {
                      createUploadUrl({
                        variables: {
                          filename: file.name,
                        },
                      })
                        .then((response) => {
                          if (response.data) {
                            uploadFile(
                              file,
                              response.data.createUploadUrl,
                              slugify(field.title),
                            ).then(() =>
                              resolve(
                                response.data?.createUploadUrl.fields.key,
                              ),
                            )
                          } else {
                            reject() // Reject in case response.data is null or undefined
                          }
                        })
                        .catch(() => reject())
                    })
                  }),
                )
                  .then((fileNames) =>
                    resolve([slugify(field.title), fileNames]),
                  )
                  .catch(() => reject())
              })
            }),
        )

        const _data = {
          ...data,
          ...Object.fromEntries(
            form.fields
              .filter((field) => field.type === FormFieldType.FILE)
              .map((field) => [
                slugify(field.title),
                JSON.stringify(
                  (files as string[][]).find(
                    (file) => file[0] === slugify(field.title),
                  )?.[1],
                ),
              ]),
          ),
        }
        setData(_data)

        submit({
          variables: {
            input: {
              id: form.id,
              name: data['name'] ?? '',
              email: data['email'] ?? '',
              message: formatBody(_data),
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              files: files.map((f) => f[1]).flat(),
              recipientFormFieldDeciderValue:
                getRecipientFormFieldDeciderValue(),
            },
          },
        }).then(() => {
          setSubmitting(false)
          setSubmitError(false)
        })
      }
    } catch (e) {
      setSubmitting(false)
      setSubmitError(true)
    }
  }

  const success = !!result?.genericForm?.sent
  const failure = result?.genericForm?.sent === false || !!error || submitError

  return (
    <Box
      background="blue100"
      paddingY={[3, 3, 5]}
      paddingX={[3, 3, 3, 3, 12]}
      borderRadius="large"
    >
      {success && (
        <>
          <Text variant="h3" marginBottom={2} color="blue600">
            {n('formSuccessTitle', 'Sending tókst!')}
          </Text>
          <Text marginBottom={2}>{form.successText}</Text>
        </>
      )}
      {failure && (
        <>
          <Text variant="h3" marginBottom={2} color="blue600">
            {n('formErrorTitle', 'Úps, eitthvað fór úrskeiðis')}
          </Text>
          <Text marginBottom={2}>
            {n(
              'formEmailUnknownError',
              'Villa kom upp við sendingu. Reynið aftur síðar.',
            )}
          </Text>
        </>
      )}
      {!success && !failure && (
        <>
          <Text variant="h2" marginBottom={2} color="blue600">
            {form.title}
          </Text>
          <Text marginBottom={2}>{form.intro}</Text>
          <Text variant="h5" color="blue600" marginBottom={2} marginTop={4}>
            {form.aboutYouHeadingText}
          </Text>
          <Stack space={4}>
            {defaultNameFieldIsShown && (
              <Input
                placeholder={
                  defaultNamespace?.namePlaceholder ??
                  n('formNamePlaceholder', 'Nafnið þitt')
                }
                name="name"
                label={
                  defaultNamespace?.nameLabel ?? n('formFullName', 'Fullt nafn')
                }
                required={true}
                value={data['name'] ?? ''}
                hasError={!!errors.find((error) => error.field === 'name')}
                errorMessage={
                  errors.find((error) => error.field === 'name')?.error
                }
                onChange={(e) => onChange('name', e.target.value)}
              />
            )}
            {defaultEmailFieldIsShown && (
              <Input
                placeholder={
                  defaultNamespace?.emailPlaceholder ??
                  n('formEmailPlaceholder', 'Netfang')
                }
                name="email"
                label={
                  defaultNamespace?.emailLabel ?? n('formEmail', 'Netfang')
                }
                required={true}
                value={data['email'] ?? ''}
                hasError={!!errors.find((error) => error.field === 'email')}
                errorMessage={
                  errors.find((error) => error.field === 'email')?.error
                }
                onChange={(e) => onChange('email', e.target.value)}
              />
            )}
          </Stack>
          <Text variant="h5" color="blue600" marginBottom={2} marginTop={4}>
            {form.questionsHeadingText}
          </Text>
          <Stack space={4}>
            {form.fields
              .filter((field) => field.type !== FormFieldType.FILE)
              .map((field) => {
                const slug = slugify(field.title)
                return (
                  <FormField
                    key={field.id}
                    field={field}
                    slug={slug}
                    value={data[slug] ?? ''}
                    error={errors.find((error) => error.field === slug)?.error}
                    onChange={(key, value) => {
                      if (field.type === FormFieldType.CHECKBOXES) {
                        const prevFieldData = data[slug]
                        if (prevFieldData) {
                          const json = JSON.parse(prevFieldData)
                          json[key] =
                            json[key] === 'false' || !json[key]
                              ? 'true'
                              : 'false'
                          onChange(slug, JSON.stringify(json))
                        } else {
                          onChange(slug, JSON.stringify({ [key]: 'true' }))
                        }
                      } else {
                        onChange(key, value)
                      }
                    }}
                  />
                )
              })}
            {form.fields
              .filter((field) => field.type === FormFieldType.FILE)
              .map((field) => {
                const slug = slugify(field.title)
                return (
                  <InputFileUpload
                    key={slug}
                    header={field.title}
                    description={field.placeholder}
                    buttonLabel={n('formSelectFiles', 'Veldu skrár')}
                    accept={Object.values(fileExtensionWhitelist)}
                    fileList={fileList[slug]}
                    errorMessage={
                      errors.find((error) => error.field === slug)?.error
                    }
                    onChange={(files) =>
                      setFileList({ ...fileList, [slug]: files })
                    }
                    onRemove={(file) =>
                      setFileList({
                        ...fileList,
                        [slug]: fileList[slug].filter(
                          (f) => f.key !== file.key,
                        ),
                      })
                    }
                  />
                )
              })}
            <Box display="flex" justifyContent="flexEnd">
              <Button onClick={() => onSubmit()} loading={isSubmitting}>
                {n('formSend', 'Senda')}
              </Button>
            </Box>
          </Stack>
        </>
      )}
    </Box>
  )
}
