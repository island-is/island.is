import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import * as kennitala from 'kennitala'

import {
  Box,
  Input,
  Button,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

function GrantAccess() {
  const { handleSubmit, control, errors, reset } = useForm()
  const { formatMessage } = useLocale()
  const history = useHistory()
  const loading = false

  const onSubmit = handleSubmit(({ name, nationalId }) => {
    // TODO: mutate
    history.push(nationalId)
  })

  return (
    <Box>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal:access-control-grant-title',
          defaultMessage: 'Veita aðgang',
        })}
        intro={defineMessage({
          id: 'service.portal:access-control-grant-intro',
          defaultMessage:
            'Hér getur þú gefið öðrum aðgang til að sýsla með þín gögn hjá island.is',
        })}
      />

      <form onSubmit={onSubmit}>
        <GridRow marginBottom={3}>
          <GridColumn paddingBottom={2} span="12/12">
            <Text variant="h5">
              {formatMessage({
                id: 'service.portal:access-control-grant-form-label',
                defaultMessage: 'Sláðu inn upplýsingar aðgangshafa',
              })}
            </Text>
          </GridColumn>
          <GridColumn paddingBottom={2} span={['12/12', '12/12', '6/12']}>
            <Controller
              control={control}
              name="nationalId"
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: formatMessage({
                    id: 'service.portal:access-control-grant-required-ssn',
                    defaultMessage: 'Skylda er að fylla út kennitölu',
                  }),
                },
                validate: {
                  value: (value) => {
                    if (!kennitala.isValid(value)) {
                      return formatMessage({
                        id: 'service.portal:access-control-grant-invalid-ssn',
                        defaultMessage: 'Kennitalan er ekki gild kennitala',
                      })
                    }
                  },
                },
              }}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  label={formatMessage({
                    id: 'global:nationalId',
                    defaultMessage: 'Kennitala',
                  })}
                  placeholder={formatMessage({
                    id: 'global:nationalId',
                    defaultMessage: 'Kennitala',
                  })}
                  value={value}
                  hasError={errors.nationalId}
                  errorMessage={errors.nationalId?.message}
                  onChange={onChange}
                />
              )}
            />
          </GridColumn>
          <GridColumn paddingBottom={2} span={['12/12', '12/12', '6/12']}>
            <Controller
              control={control}
              name="name"
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: formatMessage({
                    id: 'service.portal:access-control-grant-required-name',
                    defaultMessage: 'Skylda er að fylla út aðgangshafa',
                  }),
                },
              }}
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  label={formatMessage({
                    id: 'service.portal:access-control-grant-label-user',
                    defaultMessage: 'Aðfangshafi',
                  })}
                  placeholder={formatMessage({
                    id: 'service.portal:access-control-grant-placeholder-user',
                    defaultMessage: 'Nafn',
                  })}
                  value={value}
                  hasError={errors.name}
                  errorMessage={errors.name?.message}
                  onChange={onChange}
                />
              )}
            />
          </GridColumn>
        </GridRow>
        <Box display="flex" justifyContent="flexEnd">
          <Button type="submit" icon="arrowForward" disabled={loading}>
            {formatMessage({
              id: 'service.portal:access-control-grant-form-submit',
              defaultMessage: 'Áfram',
            })}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default GrantAccess
