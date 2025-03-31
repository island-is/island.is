import * as kennitala from 'kennitala'
import React, { BaseSyntheticEvent, FC, useContext } from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types'
import { DeepMap } from 'react-hook-form/dist/types/utils'

import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  hasDeveloperRole,
  hasMunicipalityRole,
} from '@island.is/skilavottord-web/auth/utils'
import UserContext from '@island.is/skilavottord-web/context/UserContext'
import { Query, Role } from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { encode } from '@island.is/skilavottord-web/utils/encodeUtils'

interface RecyclingCompanyForm {
  onSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>
  onCancel: () => void
  errors: DeepMap<FieldValues, FieldError>
  editView?: boolean
  isMunicipalityPage?: boolean | undefined
}

export const SkilavottordAllMunicipalitiesQuery = gql`
  query skilavottordAllMunicipalitiesQuery {
    skilavottordAllMunicipalities {
      companyId
      companyName
    }
  }
`

const RecyclingCompanyForm: FC<
  React.PropsWithChildren<RecyclingCompanyForm>
> = ({
  onSubmit,
  onCancel,
  errors,
  editView = false,
  isMunicipalityPage = false,
}) => {
  const { user } = useContext(UserContext)
  const { setValue, control } = useFormContext()

  const {
    t: { recyclingCompanies: t },
  } = useI18n()

  const { data, error, loading } =
    useQuery<Query>(SkilavottordAllMunicipalitiesQuery, {
      fetchPolicy: 'cache-and-network',
    }) || []

  if (error) {
    console.error('Failed to fetch municipalities:', error)
  }

  const municipalities = data?.skilavottordAllMunicipalities
    .map((municipality) => ({
      label: municipality.companyName,
      value: municipality.companyId,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <form onSubmit={onSubmit}>
      <GridContainer>
        <Stack space={3}>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 3, 0]}
            >
              <InputController
                id="companyId"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.companyId.label}
                placeholder={
                  t.recyclingCompany.form.inputs.companyId.placeholder
                }
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.companyId.rules?.required,
                  },
                }}
                error={errors?.companyId?.message}
                disabled={editView || user?.role === Role.municipality}
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <InputController
                id="companyName"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.companyName.label}
                placeholder={
                  t.recyclingCompany.form.inputs.companyName.placeholder
                }
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.companyName.rules
                        ?.required,
                  },
                }}
                error={errors?.companyName?.message}
                backgroundColor="blue"
                onChange={(event) => {
                  // User with the municipality role should not be able to create his own companyId
                  if (!editView && user?.role === Role.municipality) {
                    setValue(
                      'companyId',
                      user?.partnerId + '-' + encode(event.target.value),
                    )
                  }
                }}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 3, 0]}
            >
              <InputController
                id="nationalId"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.nationalId.label}
                placeholder={
                  t.recyclingCompany.form.inputs.nationalId.placeholder
                }
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.nationalId.rules?.required,
                  },
                  validate: {
                    value: (value: number) => {
                      if (
                        value.toString().length === 10 &&
                        !kennitala.isValid(value.toString())
                      ) {
                        return t.recyclingCompany.form.inputs.nationalId.rules
                          ?.validate
                      }
                    },
                  },
                }}
                type="tel"
                format="######-####"
                error={errors?.nationalId?.message}
                disabled={editView}
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <InputController
                id="email"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.email.label}
                placeholder={t.recyclingCompany.form.inputs.email.placeholder}
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.email.rules?.required,
                  },
                  pattern: {
                    value:
                      /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i,
                    message:
                      t.recyclingCompany.form.inputs.email.rules?.validate,
                  },
                }}
                error={errors?.email?.message}
                backgroundColor="blue"
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span="12/12">
              <InputController
                id="address"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.address.label}
                placeholder={t.recyclingCompany.form.inputs.address.placeholder}
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.address.rules?.required,
                  },
                }}
                error={errors?.address?.message}
                backgroundColor="blue"
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 3, 0]}
            >
              <InputController
                id="postnumber"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.postnumber.label}
                placeholder={
                  t.recyclingCompany.form.inputs.postnumber.placeholder
                }
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.postnumber.rules?.required,
                  },
                }}
                error={errors?.postnumber?.message}
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <InputController
                id="city"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.city.label}
                placeholder={t.recyclingCompany.form.inputs.city.placeholder}
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.city.rules?.required,
                  },
                }}
                error={errors?.city?.message}
                backgroundColor="blue"
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 3, 0]}
            >
              <InputController
                id="website"
                control={control}
                label={t.recyclingCompany.form.inputs.website.label}
                placeholder={t.recyclingCompany.form.inputs.website.placeholder}
                error={errors?.website?.message}
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <InputController
                id="phone"
                control={control}
                required
                label={t.recyclingCompany.form.inputs.phone.label}
                placeholder={t.recyclingCompany.form.inputs.phone.placeholder}
                rules={{
                  required: {
                    value: true,
                    message:
                      t.recyclingCompany.form.inputs.phone.rules?.required,
                  },
                }}
                type="tel"
                error={errors?.phone?.message}
                backgroundColor="blue"
              />
            </GridColumn>
          </GridRow>
          {!isMunicipalityPage && (
            <GridRow>
              <GridColumn span="12/12">
                <Controller
                  name="municipalityId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Select
                        name={name}
                        label={
                          t.recyclingCompany.form.inputs.municipality.label
                        }
                        placeholder={
                          t.recyclingCompany.form.inputs.municipality
                            .placeholder
                        }
                        size="md"
                        value={municipalities?.find(
                          (option) => option.value === value,
                        )}
                        hasError={!!errors?.municipality?.message}
                        errorMessage={errors?.municipality?.message}
                        backgroundColor="blue"
                        options={municipalities}
                        onChange={onChange}
                        isCreatable
                        isDisabled={hasMunicipalityRole(user?.role)}
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>
          )}
          <GridRow>
            <GridColumn span="12/12">
              <Controller
                name="active"
                control={control}
                render={({ field: { onChange, value, name } }) => {
                  return (
                    <Checkbox
                      large
                      name={name}
                      label={t.recyclingCompany.form.inputs.active.label}
                      hasError={!!errors?.partnerId?.message}
                      errorMessage={errors?.partnerId?.message}
                      backgroundColor="blue"
                      onChange={() => {
                        onChange(!value)
                      }}
                      checked={value ? value : false}
                    />
                  )
                }}
              />
            </GridColumn>
          </GridRow>
          <Box
            style={{
              display:
                user?.role && hasDeveloperRole(user.role) ? 'block' : 'none',
            }}
          >
            <GridRow>
              <GridColumn span="12/12">
                <Controller
                  name="isMunicipality"
                  control={control}
                  defaultValue={isMunicipalityPage}
                  render={({ field: { onChange, value, name } }) => (
                    <Checkbox
                      large
                      label="Er sveitarfélag"
                      name={name}
                      backgroundColor="blue"
                      onChange={(e) => onChange(e.target.checked)}
                      checked={value}
                    />
                  )}
                />
              </GridColumn>
            </GridRow>
          </Box>
        </Stack>
      </GridContainer>
      <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
        {editView ? (
          <Button variant="ghost" onClick={onCancel} preTextIcon="arrowBack">
            {t.recyclingCompany.form.buttons.goBack}
          </Button>
        ) : (
          <Button variant="ghost" onClick={onCancel}>
            {t.recyclingCompany.form.buttons.cancel}
          </Button>
        )}

        <Button icon="save" type="submit" disabled={loading}>
          {t.recyclingCompany.form.buttons.confirm}
        </Button>
      </Box>
    </form>
  )
}

export default RecyclingCompanyForm
