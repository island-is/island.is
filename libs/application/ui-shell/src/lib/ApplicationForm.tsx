import React, { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_APPLICATION } from '@island.is/application/graphql'
import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Form,
  Schema,
} from '@island.is/application/core'
import { FormShell } from './FormShell'
import {
  getApplicationStateInformation,
  getApplicationTemplateByTypeId,
  getApplicationUIFields,
} from '@island.is/application/template-loader'
import { FieldProvider, useFields } from '../components/FieldContext'
import { EventObject } from 'xstate'
import { NotFound } from './NotFound'

function isOnProduction(): boolean {
  // TODO detect better when the application system is on production
  return false
}

const ShellWrapper: FC<{
  applicationId: string
  nationalRegistryId: string
}> = ({ applicationId, nationalRegistryId }) => {
  const [dataSchema, setDataSchema] = useState<Schema>()
  const [form, setForm] = useState<Form>()
  const [t, setTemplate] = useState<
    ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >
  >()
  const [, fieldsDispatch] = useFields()

  const { data, error, loading } = useQuery(GET_APPLICATION, {
    variables: {
      input: {
        id: applicationId,
      },
    },
    skip: !applicationId,
  })

  const application = data?.getApplication

  useEffect(() => {
    async function populateForm() {
      if (application !== undefined && form === undefined) {
        const template = await getApplicationTemplateByTypeId(
          application.typeId,
        )
        if (
          template !== null &&
          !(isOnProduction() && !template.readyForProduction)
        ) {
          const stateInformation = await getApplicationStateInformation(
            application,
          )
          const applicationFields = await getApplicationUIFields(
            application.typeId,
          )
          setTemplate(template)
          fieldsDispatch(applicationFields)
          const role = template.mapUserToRole(
            nationalRegistryId,
            application.state,
          )
          if (stateInformation?.roles?.length) {
            const currentRole = stateInformation.roles.find(
              (r) => r.id === role,
            )
            if (currentRole && currentRole.formLoader) {
              const formDescriptor = await currentRole.formLoader()
              setForm(formDescriptor)
              setDataSchema(template.dataSchema)
            }
          }
        }
      }
    }
    populateForm()
  }, [fieldsDispatch, application, form, nationalRegistryId])

  if (!applicationId || error) {
    return <NotFound />
  }
  // TODO we need better loading states
  if (loading || !t || !form || !dataSchema) {
    return null
  }
  return (
    <FormShell
      application={application}
      dataSchema={dataSchema}
      extendDataSchema={t.extendDataSchema}
      form={form}
      nationalRegistryId={nationalRegistryId}
    />
  )
}

export const ApplicationForm: FC<{
  applicationId: string
  nationalRegistryId: string
}> = ({ applicationId, nationalRegistryId }) => {
  return (
    <FieldProvider>
      <ShellWrapper
        applicationId={applicationId}
        nationalRegistryId={nationalRegistryId}
      />
    </FieldProvider>
  )
}
