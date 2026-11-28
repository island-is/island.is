import { MockedProvider } from '@apollo/client/testing'
import { validateAnswers } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  BeforeSubmitCallback,
  Field,
  FieldBaseProps,
  FormValue,
  Schema,
  SetBeforeSubmitCallbackOptions,
} from '@island.is/application/types'
import { render } from '@testing-library/react'
import get from 'lodash/get'
import { ComponentType } from 'react'
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form'

export const formatMessage = (
  message: unknown,
  values?: Record<string, unknown>,
) => {
  const text =
    typeof message === 'string'
      ? message
      : (message as { defaultMessage: string }).defaultMessage
  return values
    ? text.replace(/\{(\w+)\}/g, (_, key) => String(values[key]))
    : text
}

export const buildApplication = (
  answers: FormValue = {},
  externalData: Application['externalData'] = {},
): Application => ({
  id: 'test-application',
  assignees: [],
  typeId: ApplicationTypes.EXAMPLE_INPUTS,
  externalData,
  answers,
  applicant: '0101302989',
  state: 'draft',
  modified: new Date(),
  created: new Date(),
  status: ApplicationStatus.IN_PROGRESS,
  applicantActors: [],
})

type SubmitResult =
  | { outcome: 'invalid' }
  | { outcome: 'blocked'; message: string | null | undefined }
  | { outcome: 'submitted' }

interface Options<F> {
  Component: ComponentType<FieldBaseProps & { field: F }>
  field: F
  answers?: FormValue
  externalData?: Application['externalData']
  dataSchema?: Schema
}

export const renderRepeater = <F extends Field>({
  Component,
  field,
  answers = {},
  externalData = {},
  dataSchema,
}: Options<F>) => {
  const application = buildApplication(answers, externalData)
  const callbacks = new Map<string, BeforeSubmitCallback>()
  let form: UseFormReturn<FormValue> | undefined

  const setBeforeSubmitCallback = (
    callback: BeforeSubmitCallback | null,
    options?: SetBeforeSubmitCallbackOptions,
  ) => {
    if (callback === null) {
      callbacks.clear()
      return
    }
    const id = options?.customCallbackId ?? String(callbacks.size)
    if (!options?.allowMultiple) callbacks.clear()
    callbacks.set(id, callback)
  }

  const Harness = () => {
    form = useForm<FormValue>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues: answers,
      shouldUnregister: false,
      resolver: (values) => {
        const errors = dataSchema
          ? validateAnswers({
              dataSchema,
              answers: values,
              currentScreenFields: [field.id as string],
              formatMessage,
            })
          : undefined
        return errors
          ? { values: {}, errors: errors as never }
          : { values, errors: {} }
      },
    })
    const error = get(form.formState.errors, field.id as string)

    return (
      <FormProvider {...form}>
        <Component
          application={application}
          field={field}
          error={error as unknown as string}
          errors={form.formState.errors as never}
          showFieldName
          setBeforeSubmitCallback={setBeforeSubmitCallback}
        />
      </FormProvider>
    )
  }

  const utils = render(
    <MockedProvider mocks={[]}>
      <Harness />
    </MockedProvider>,
  )

  const getForm = () => {
    if (!form) throw new Error('Form not rendered')
    return form
  }

  const submit = async (): Promise<SubmitResult> => {
    let valid = false
    await getForm().handleSubmit(
      () => {
        valid = true
      },
      () => undefined,
    )()
    if (!valid) return { outcome: 'invalid' }

    for (const callback of callbacks.values()) {
      const [ok, message] = await callback()
      if (!ok) return { outcome: 'blocked', message }
    }
    return { outcome: 'submitted' }
  }

  return { ...utils, application, getForm, submit }
}
