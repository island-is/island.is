import React, { FC, ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { FormProvider, useForm } from 'react-hook-form'

const Form: FC<{ defaultValues: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const hookFormData = useForm({ defaultValues })

  return <FormProvider {...hookFormData}>{children}</FormProvider>
}

export const Providers = (storyFn: () => ReactNode) => (
  <IntlProvider locale="is" messages={{}} defaultLocale="is">
    <Form defaultValues={{}}>{storyFn()}</Form>
  </IntlProvider>
)
