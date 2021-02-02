import React, { FC } from 'react'
import { ExternalDataProviderScreen, SetBeforeSubmitCallback } from '../types'
import {
  Box,
  Checkbox,
  Icon,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import {
  DataProviderItem,
  DataProviderResult,
  ExternalData,
  FormValue,
  getValueViaPath,
} from '@island.is/application/core'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { Controller, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { verifyExternalData } from '../utils'

const ProviderItem: FC<{
  dataProviderResult: DataProviderResult
  provider: DataProviderItem
}> = ({ dataProviderResult = {}, provider }) => {
  const { subTitle, title } = provider
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={3}>
      <Text variant="h4" color="blue400">
        {formatMessage(title)}
      </Text>
      {subTitle && <Text>{formatMessage(subTitle)}</Text>}
      {provider.type && dataProviderResult?.status === 'failure' && (
        <InputError
          errorMessage={dataProviderResult?.reason}
          id={provider.id}
        />
      )}
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

const FormExternalDataProvider: FC<{
  applicationId: string
  addExternalData(data: ExternalData): void
  setBeforeSubmitCallback: SetBeforeSubmitCallback
  externalData: ExternalData
  externalDataProvider: ExternalDataProviderScreen
  formValue: FormValue
}> = ({
  addExternalData,
  setBeforeSubmitCallback,
  applicationId,
  externalData,
  externalDataProvider,
  formValue,
}) => {
  const { setValue } = useFormContext()
  const [updateExternalData] = useMutation(UPDATE_APPLICATION_EXTERNAL_DATA, {
    onCompleted(responseData: UpdateApplicationExternalDataResponse) {
      addExternalData(getExternalDataFromResponse(responseData))
    },
  })

  const { id, dataProviders, subTitle, checkboxLabel } = externalDataProvider
  const relevantDataProviders = dataProviders.filter((p) => p.type)

  const activateBeforeSubmitCallback = (checked: boolean) => {
    if (checked) {
      setBeforeSubmitCallback(async () => {
        const response = await updateExternalData({
          variables: {
            input: {
              id: applicationId,
              dataProviders: relevantDataProviders.map(({ id, type }) => ({
                id,
                type,
              })),
            },
          },
        })

        if (
          response.data &&
          verifyExternalData(
            getExternalDataFromResponse(response.data),
            relevantDataProviders,
          )
        ) {
          return [true, null]
        }

        // TODO: translated
        return [false, 'Failed to update application']
      })
    } else {
      setBeforeSubmitCallback(null)
    }
  }

  return (
    <Box>
      <Box
        marginTop={2}
        marginBottom={5}
        display="flex"
        alignItems="center"
        justifyContent="flexStart"
      >
        <Box marginRight={1}>
          <Icon icon="download" size="medium" color="blue400" type="outline" />
        </Box>
        <Text variant="h4">
          {subTitle || 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki'}
        </Text>
      </Box>
      <Box marginBottom={5}>
        {dataProviders.map((provider) => (
          <ProviderItem
            provider={provider}
            key={provider.id}
            dataProviderResult={externalData[provider.id]}
          />
        ))}
      </Box>
      <Controller
        name={`${id}`}
        defaultValue={getValueViaPath(formValue, id as string, false)}
        rules={{ required: true }}
        render={({ value, onChange }) => {
          return (
            <>
              <Box
                background="blue100"
                display="flex"
                padding={4}
                borderRadius="large"
                marginTop={1}
                key={`${id}`}
              >
                <Checkbox
                  onChange={(e) => {
                    const isChecked = e.target.checked
                    setValue(id as string, isChecked)
                    onChange(isChecked)
                    activateBeforeSubmitCallback(isChecked)
                  }}
                  checked={value}
                  name={`${id}`}
                  label={checkboxLabel || 'Ég samþykki'}
                  value={id}
                />
              </Box>
            </>
          )
        }}
      />
    </Box>
  )
}

export default FormExternalDataProvider
