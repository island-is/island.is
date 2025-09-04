import { FC, useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
  Text,
} from '@island.is/island-ui/core'

import * as styles from '../styles.css'
import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { ErrorValue } from '../../types'

interface ClaimFormField {
  id: string
  publisher?: string
  value?: string
  nationalId?: string
  initial?: boolean
  enabled?: boolean
}

interface ClaimsRepeaterProps {
  field: {
    props: {
      repeaterButtonText: string
    }
  }
}

export const ClaimsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & ClaimsRepeaterProps>
> = ({ application, field, errors }) => {
  const { id } = field
  const repeaterButtonText = field?.props?.repeaterButtonText
  const error = (errors as ErrorValue)?.estate?.claims
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const { control, clearErrors } = useFormContext()
  const estateData = getEstateDataFromApplication(application)

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.claims) {
      replace(estateData.estate.claims)
    }
  }, [])

  const handleAddClaim = () =>
    append({
      publisher: '',
      value: '',
      nationalId: '',
      initial: false,
      enabled: true,
    })

  const handleRemoveClaim = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, claim: ClaimFormField, index) => {
          if (!claim.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              key={claim.id}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                disabled={!claim.enabled}
                title={
                  claim.publisher || formatMessage(m.claimsTitle)
                }
                key={claim.publisher}
                description={[
                  `${formatMessage(m.claimsAmount)}: ${
                    claim.value || '0'
                  } kr.`,
                  `${formatMessage(m.nationalId)}: ${
                    claim.nationalId || ''
                  }`,
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={claim.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() => {
                        const updatedClaim = {
                          ...claim,
                          enabled: !claim.enabled,
                        }
                        update(index, updatedClaim)
                        clearErrors(`${id}[${index}].value`)
                      }}
                    >
                      {claim.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
              />
              <Box marginTop={2}>
                <InputController
                  id={`${id}[${index}].value`}
                  name={`${id}[${index}].value`}
                  label={formatMessage(m.claimsAmount)}
                  disabled={!claim.enabled}
                  backgroundColor="blue"
                  placeholder="0 kr."
                  defaultValue={claim.value}
                  error={error && error[index]?.value}
                  currency
                  size="sm"
                  required
                />
              </Box>
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field: ClaimFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const publisherField = `${fieldIndex}.publisher`
        const valueField = `${fieldIndex}.value`
        const nationalIdField = `${fieldIndex}.nationalId`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial}
          >
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={true}
              render={() => <input type="hidden" />}
            />
            <Text variant="h4">{formatMessage(m.claimsTitle)}</Text>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveClaim.bind(null, index)}
              />
            </Box>
            <GridRow>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={publisherField}
                  name={publisherField}
                  label={formatMessage(m.claimsPublisher)}
                  backgroundColor="blue"
                  defaultValue={field.publisher}
                  error={fieldError?.publisher}
                  size="sm"
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={valueField}
                  name={valueField}
                  label={formatMessage(m.claimsAmount)}
                  defaultValue={field.value}
                  placeholder="0 kr."
                  error={fieldError?.value}
                  currency
                  size="sm"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={nationalIdField}
                  name={nationalIdField}
                  label={formatMessage(m.nationalId)}
                  defaultValue={field.nationalId}
                  placeholder="000000-0000"
                  error={fieldError?.nationalId}
                  format="######-####"
                  size="sm"
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddClaim}
          size="small"
        >
          {formatMessage(repeaterButtonText)}
        </Button>
      </Box>
    </Box>
  )
}

export default ClaimsRepeater
