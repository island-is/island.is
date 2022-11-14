import { useState } from 'react'
import slugify from '@sindresorhus/slugify'
import { useMutation } from '@apollo/client/react'

import {
  Box,
  Text,
  Input,
  Select,
  RadioButton,
  Stack,
  Checkbox,
  Button,
  Option,
} from '@island.is/island-ui/core'
import {
  Form as FormType,
  GenericFormMutation,
  GenericFormMutationVariables,
} from '@island.is/web/graphql/schema'
import { isEmailValid } from '@island.is/financial-aid/shared/lib'
import { GENERIC_FORM_MUTATION } from '@island.is/web/screens/queries/Form'
import { useNamespace } from '@island.is/web/hooks'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import * as styles from './Form.css'

enum FormFieldType {
  CHECKBOXES = 'checkboxes',
  EMAIL = 'email',
  ACCEPT_TERMS = 'acceptTerms',
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
    case 'input':
    case 'email':
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
    case 'text':
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
    case 'dropdown': {
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
          onChange={({ value }: Option) => onChange(slug, value as string)}
          hasError={!!error}
          errorMessage={error}
        />
      )
    }
    case 'radio':
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
    case 'acceptTerms':
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
    case 'checkboxes':
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
  }
}

type ErrorData = {
  field: string
  error?: string
}

export const Form = ({ form, namespace }: FormProps) => {
  const n = useNamespace(namespace)

  const [data, setData] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      form.fields
        .map((field): [string, string] => [slugify(field.title), ''])
        .concat([
          ['name', ''],
          ['email', ''],
        ]),
    ),
  )
  const [errors, setErrors] = useState<ErrorData[]>([])

  const [submit, { data: result, loading, error }] = useMutation<
    GenericFormMutation,
    GenericFormMutationVariables
  >(GENERIC_FORM_MUTATION)

  const onChange = (field, value) => {
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

          if (slug === 'email' && !isEmailValid(data['email'])) {
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
          (field.required && !data[slug]) ||
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

        return null
      })
      .filter((x) => !!x)

    setErrors(err)

    return !err.length
  }

  const formatBody = () => {
    return `Sendandi: ${data['name']} <${data['email']}>\n\n`.concat(
      form.fields
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

  const onSubmit = () => {
    const valid = validate()

    if (valid) {
      submit({
        variables: {
          input: {
            id: form.id,
            name: data['name'],
            email: data['email'],
            message: formatBody(),
            recipientFormFieldDeciderValue: getRecipientFormFieldDeciderValue(),
          },
        },
      })
    }
  }

  const success = !!result?.genericForm?.sent
  const failure = result?.genericForm?.sent === false || !!error

  return (
    <Box background="blue100" paddingY={8} paddingX={12} borderRadius="large">
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
            <Input
              placeholder={n('formNamePlaceholder', 'Nafnið þitt')}
              name="name"
              label={n('formFullName', 'Fullt nafn')}
              required={true}
              value={data['name'] ?? ''}
              hasError={!!errors.find((error) => error.field === 'name')}
              errorMessage={
                errors.find((error) => error.field === 'name')?.error
              }
              onChange={(e) => onChange('name', e.target.value)}
            />
            <Input
              placeholder={n('formEmailPlaceholder', 'Netfang')}
              name="email"
              label={n('formEmail', 'Netfang')}
              required={true}
              value={data['email'] ?? ''}
              hasError={!!errors.find((error) => error.field === 'email')}
              errorMessage={
                errors.find((error) => error.field === 'email')?.error
              }
              onChange={(e) => onChange('email', e.target.value)}
            />
          </Stack>
          <Text variant="h5" color="blue600" marginBottom={2} marginTop={4}>
            {form.questionsHeadingText}
          </Text>
          <Stack space={4}>
            {form.fields.map((field) => {
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
                          json[key] === 'false' || !json[key] ? 'true' : 'false'
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
            <Box display="flex" justifyContent="flexEnd">
              <Button onClick={() => onSubmit()} loading={loading}>
                {n('formSend', 'Senda')}
              </Button>
            </Box>
          </Stack>
        </>
      )}
    </Box>
  )
}
