import React, { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_APPLICATION } from '@island.is/application/graphql'
import {
  Application,
  ApplicationTemplateHelper,
  Form,
  Schema,
} from '@island.is/application/core'
import { FormShell } from './FormShell'
import {
  getApplicationTemplateByTypeId,
  getApplicationUIFields,
} from '@island.is/application/template-loader'
import { FieldProvider, useFields } from '../components/FieldContext'
import { NotFound } from './NotFound'

function isOnProduction(): boolean {
  // TODO detect better when the application system is on production
  return false
}

const ApplicationLoader: FC<{
  applicationId: string
  nationalRegistryId: string
}> = ({ applicationId, nationalRegistryId }) => {
  const { data, error, loading } = useQuery(GET_APPLICATION, {
    variables: {
      input: {
        id: applicationId,
      },
    },
    skip: !applicationId,
  })

  const application = data?.getApplication

  if (!applicationId || error) {
    return <NotFound />
  }
  // TODO we need better loading states
  if (loading) {
    return null
  }
  return (
    <ShellWrapper
      application={application}
      nationalRegistryId={nationalRegistryId}
    />
  )
}

const ShellWrapper: FC<{
  application: Application
  nationalRegistryId: string
}> = ({ application, nationalRegistryId }) => {
  const [dataSchema, setDataSchema] = useState<Schema>()
  const [form, setForm] = useState<Form>()
  const [, fieldsDispatch] = useFields()

  useEffect(() => {
    async function populateForm() {
      console.log('popluate')
      if (dataSchema === undefined && form === undefined) {
        console.log('load templates')
        const template = await getApplicationTemplateByTypeId(
          application.typeId,
        )
        if (
          template !== null &&
          !(isOnProduction() && !template.readyForProduction)
        ) {
          const helper = new ApplicationTemplateHelper(application, template)
          const stateInformation =
            helper.getApplicationStateInformation() || null
          if (stateInformation?.roles?.length) {
            const applicationFields = await getApplicationUIFields(
              application.typeId,
            )
            const role = template.mapUserToRole(
              nationalRegistryId,
              application.state,
            )
            const currentRole = stateInformation.roles.find(
              (r) => r.id === role,
            )
            if (currentRole && currentRole.formLoader) {
              const formDescriptor = await currentRole.formLoader()
              setForm(formDescriptor)
              setDataSchema(template.dataSchema)
              fieldsDispatch(applicationFields)
            }
          }
        }
      }
    }
    populateForm()
  }, [fieldsDispatch, application, form, nationalRegistryId, dataSchema])

  // TODO we need better loading states
  if (!form || !dataSchema) {
    return null
  }
  return (
    <FormShell
      application={application}
      dataSchema={dataSchema}
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
      <ApplicationLoader
        applicationId={applicationId}
        nationalRegistryId={nationalRegistryId}
      />
    </FieldProvider>
  )
}
