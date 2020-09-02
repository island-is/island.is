import React, { FC } from 'react'
import { ExternalDataProviderScreen } from '../types'
import {
  Box,
  Button,
  Checkbox,
  Icon,
  InputError,
  Typography,
} from '@island.is/island-ui/core'
import {
  DataProviderItem,
  DataProviderResult,
  ExternalData,
  FormValue,
} from '@island.is/application/schema'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { Controller, useFormContext } from 'react-hook-form'
import { getValueViaPath } from '../utils'

// TODO make pretty
const ProviderItem: FC<{
  dataProviderResult: DataProviderResult
  provider: DataProviderItem
}> = ({ dataProviderResult = {}, provider }) => {
  const { subTitle, title, source } = provider
  const { status } = dataProviderResult
  return (
    <Box border="standard" borderRadius="standard" padding={4}>
      <Typography variant="h4">
        <Icon
          type="external"
          color={
            status === 'failure'
              ? 'red400'
              : status === 'success'
              ? 'blue600'
              : 'dark200'
          }
        />
        {title}
        {source ? ` frá ${source}` : ''}
      </Typography>
      <Typography variant="h5">{subTitle}</Typography>
      {dataProviderResult?.status === 'failure' && (
        <InputError
          errorMessage={dataProviderResult?.reason}
          id={provider.id}
        />
      )}
    </Box>
  )
}

const FormExternalDataProvider: FC<{
  applicationId: string
  addExternalData(data: ExternalData): void
  externalData: ExternalData
  externalDataProvider: ExternalDataProviderScreen
  formValue: FormValue
}> = ({
  addExternalData,
  applicationId,
  externalData,
  externalDataProvider,
  formValue,
}) => {
  const { setValue } = useFormContext()
  const [updateExternalData, { loading }] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
    {
      onCompleted({ updateApplicationExternalData }) {
        addExternalData(updateApplicationExternalData.externalData)
      },
    },
  )

  const { id, dataProviders } = externalDataProvider
  const label =
    'Ég samþykki að sækja megi ofangreindar upplýsingar til að nýta við úrvinnslu umsóknarinnar ásamt innslegnum upplýsingum og þar með til að meta hvort ég uppfylli skilyrði til að fá stuðningslán. Auk þess er mér kunnugt um að í kjölfarið verði upplýsingunum miðlað til lánastofnunar minnar. Fjármála- og efnahagsráðuneytið mun, á grundvelli upplýsinga sem Seðlabankinn móttekur frá lánastofnunum, birta opinberlega upplýsingar um rekstraraðila sem njóta ábyrgðar, innan 12 mánaða frá því lán með ábyrgð er veitt.'
  return (
    <Box>
      {dataProviders.map((provider) => (
        <ProviderItem
          provider={provider}
          key={provider.id}
          dataProviderResult={externalData[provider.id]}
        />
      ))}
      <Controller
        name={`${id}`}
        defaultValue={getValueViaPath(formValue, id, false)}
        rules={{ required: true }}
        render={({ value, onChange }) => {
          return (
            <>
              <Box display="flex" key={`${id}`}>
                <Checkbox
                  onChange={(e) => {
                    onChange(e.target.checked)
                    setValue(id, e.target.checked)
                  }}
                  checked={value}
                  name={`${id}`}
                  label={label}
                  value={id}
                />
              </Box>
              <Button
                icon="search"
                loading={loading}
                disabled={!value || loading}
                onClick={() => {
                  if (!value) {
                    return
                  }
                  updateExternalData({
                    variables: {
                      input: {
                        id: applicationId,
                        dataProviders: dataProviders.map(({ id, type }) => ({
                          id,
                          type,
                        })),
                      },
                    },
                  })
                }}
              >
                Sækja gögn
              </Button>
            </>
          )
        }}
      />
    </Box>
  )
}

export default FormExternalDataProvider
