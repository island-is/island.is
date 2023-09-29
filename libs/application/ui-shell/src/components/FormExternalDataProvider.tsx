import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Controller, useFormContext } from 'react-hook-form'

import {
  AlertMessage,
  Box,
  Checkbox,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import {
  getValueViaPath,
  coreMessages,
  getErrorReasonIfPresent,
  formatText,
} from '@island.is/application/core'
import {
  Application,
  DataProviderItem,
  DataProviderPermissionItem,
  DataProviderResult,
  ExternalData,
  FormText,
  FormValue,
  RecordObject,
  SetBeforeSubmitCallback,
} from '@island.is/application/types'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

import { ExternalDataProviderScreen } from '../types'
import { verifyExternalData } from '../utils'

import { handleServerError } from '@island.is/application/ui-components'
import { ProviderErrorReason } from '@island.is/shared/problem'

const ItemHeader: React.FC<
  React.PropsWithChildren<{
    title: FormText
    subTitle?: FormText
    pageTitle?: FormText
    application: Application
  }>
> = ({ title, subTitle, application, pageTitle }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      {pageTitle && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flexStart"
          marginTop={5}
        >
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {formatText(pageTitle, application, formatMessage)}
          </Text>
        </Box>
      )}

      <Text variant="h4" color="blue400">
        {formatText(title, application, formatMessage)}
      </Text>

      {subTitle && (
        <Text>
          <Markdown>
            {formatText(subTitle, application, formatMessage)}
          </Markdown>
        </Text>
      )}
    </>
  )
}

const ProviderItem: FC<
  React.PropsWithChildren<{
    dataProviderResult: DataProviderResult
    provider: DataProviderItem
    suppressProviderError: boolean
    application: Application
  }>
> = ({ dataProviderResult, provider, suppressProviderError, application }) => {
  const [reasons, setReasons] = useState<ProviderErrorReason[]>([])
  const { title, subTitle, pageTitle } = provider
  const { formatMessage } = useLocale()
  const showError =
    provider.id &&
    dataProviderResult?.status === 'failure' &&
    !suppressProviderError

  const errorCode = dataProviderResult?.statusCode ?? 500
  const errorType = errorCode < 500 ? 'warning' : 'error'

  useEffect(() => {
    if (dataProviderResult?.reason) {
      if (Array.isArray(dataProviderResult.reason)) {
        setReasons(dataProviderResult.reason)
      } else {
        setReasons([dataProviderResult.reason as ProviderErrorReason])
      }
    }
  }, [dataProviderResult?.reason, setReasons])

  const getAlertMessage = (reason: ProviderErrorReason) => {
    const { title: errorTitle, summary } = getErrorReasonIfPresent(reason)
    return (
      <AlertMessage
        type={errorType}
        title={formatMessage(errorTitle)}
        message={formatMessage(summary)}
      />
    )
  }

  return (
    <Box marginBottom={3}>
      <ItemHeader
        application={application}
        title={title}
        subTitle={subTitle}
        pageTitle={pageTitle}
      />

      {showError &&
        reasons.map((reason, index) => (
          <Box key={`dataprovider-error-${index}-${reason}`} marginTop={2}>
            {getAlertMessage(reason)}
          </Box>
        ))}
    </Box>
  )
}

const PermissionItem: FC<
  React.PropsWithChildren<{
    permission: DataProviderPermissionItem
    application: Application
  }>
> = ({ permission, application }) => {
  const { title, subTitle, pageTitle } = permission

  return (
    <Box marginBottom={3}>
      <ItemHeader
        application={application}
        title={title}
        subTitle={subTitle}
        pageTitle={pageTitle}
      />
    </Box>
  )
}

// TODO: generate these interfaces with graphql codegen
interface UpdateApplicationExternalDataResponse {
  updateApplicationExternalData: {
    externalData: ExternalData
  }
}

const getExternalDataFromResponse = (
  responseData: UpdateApplicationExternalDataResponse,
) => responseData?.updateApplicationExternalData?.externalData

const FormExternalDataProvider: FC<
  React.PropsWithChildren<{
    application: Application
    applicationId: string
    addExternalData(data: ExternalData): void
    setBeforeSubmitCallback: SetBeforeSubmitCallback
    externalData: ExternalData
    externalDataProvider: ExternalDataProviderScreen
    formValue: FormValue
    errors: RecordObject
  }>
> = ({
  addExternalData,
  setBeforeSubmitCallback,
  application,
  applicationId,
  externalData,
  externalDataProvider,
  formValue,
  errors,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const { setValue, clearErrors } = useFormContext()
  const [updateExternalData] = useMutation(UPDATE_APPLICATION_EXTERNAL_DATA, {
    onCompleted(responseData: UpdateApplicationExternalDataResponse) {
      addExternalData(getExternalDataFromResponse(responseData))
    },
    onError: (e) => {
      return handleServerError(e, formatMessage)
    },
  })

  const {
    id,
    dataProviders,
    otherPermissions,
    subTitle,
    description,
    checkboxLabel,
  } = externalDataProvider
  const relevantDataProviders = dataProviders.filter((p) => p.action)

  const [suppressProviderErrors, setSuppressProviderErrors] = useState(true)

  // If id is undefined then the error won't be attached to the field with id
  const error = getValueViaPath(errors, id ?? '', undefined) as
    | string
    | undefined

  const activateBeforeSubmitCallback = (checked: boolean) => {
    if (checked) {
      setBeforeSubmitCallback(async () => {
        const response = await updateExternalData({
          variables: {
            input: {
              id: applicationId,
              dataProviders: relevantDataProviders.map(({ action, order }) => ({
                actionId: action,
                order,
              })),
            },
            locale,
          },
        })

        setSuppressProviderErrors(false)
        if (
          response &&
          response.data &&
          verifyExternalData(
            getExternalDataFromResponse(response.data),
            relevantDataProviders,
          )
        ) {
          return [true, null]
        }

        return [false, '']
      })
    } else {
      setBeforeSubmitCallback(null)
    }
  }

  return (
    <Box>
      <Box marginTop={2} marginBottom={5}>
        <Box display="flex" alignItems="center" justifyContent="flexStart">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {subTitle
              ? formatMessage(subTitle)
              : formatMessage(coreMessages.externalDataTitle)}
          </Text>
        </Box>
        {description && (
          <Text marginTop={4}>
            <Markdown>{formatMessage(description)}</Markdown>
          </Text>
        )}
      </Box>
      <Box marginBottom={5}>
        {dataProviders.map((provider) => (
          <ProviderItem
            application={application}
            provider={provider}
            key={provider.id}
            suppressProviderError={suppressProviderErrors}
            dataProviderResult={externalData[provider.id]}
          />
        ))}
        {otherPermissions &&
          otherPermissions.map((permission) => (
            <PermissionItem
              application={application}
              permission={permission}
              key={permission.id}
            />
          ))}
      </Box>
      <Controller
        name={`${id}`}
        defaultValue={getValueViaPath(formValue, id as string, false)}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => {
          return (
            <Checkbox
              large={true}
              onChange={(e) => {
                const isChecked = e.target.checked
                clearErrors(id)
                setValue(id as string, isChecked)
                onChange(isChecked)
                activateBeforeSubmitCallback(isChecked)
              }}
              checked={value}
              hasError={error !== undefined}
              backgroundColor="blue"
              dataTestId="agree-to-data-providers"
              name={`${id}`}
              label={
                <Markdown>
                  {checkboxLabel
                    ? formatMessage(checkboxLabel)
                    : formatMessage(coreMessages.externalDataAgreement)}
                </Markdown>
              }
              value={id}
            />
          )
        }}
      />
    </Box>
  )
}

export default FormExternalDataProvider
