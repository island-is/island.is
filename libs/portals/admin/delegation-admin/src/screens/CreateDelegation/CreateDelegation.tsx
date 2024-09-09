import {
  Box,
  Stack,
  AlertMessage,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  Select,
  DatePicker,
} from '@island.is/island-ui/core'
import { BackButton } from '@island.is/portals/admin/core'
import { useLocale } from '@island.is/localization'
import { useSubmitting } from '@island.is/react-spa/shared'
import InputMask from 'react-input-mask'

import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import React from 'react'
import { DelegationAdminPaths } from '../../lib/paths'

import { Form, useActionData, useNavigate } from 'react-router-dom'
import { CreateDelegationResult } from './CreateDelegation.action'

const CreateDelegationScreen = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const actionData = useActionData() as CreateDelegationResult
  const { isLoading, isSubmitting } = useSubmitting()
  const [validInfinite, setValidInfinite] = React.useState(true)
  const [fromNationalId, setNationalIdFrom] = React.useState('')
  const [toNationalId, setNationalIdTo] = React.useState('')

  return (
    <Stack space="containerGutter">
      <BackButton onClick={() => navigate(DelegationAdminPaths.Root)} />
      <div>
        <IntroHeader
          title={m.delegationAdminCreateNewDelegation}
          intro={m.delegationAdminCreateNewDelegationDescription}
        />
        <Form method="post">
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <InputMask
                // eslint-disable-next-line local-rules/disallow-kennitalas
                mask="999999-9999"
                maskPlaceholder={null}
                value={fromNationalId || ''}
                onChange={(e) => {
                  setNationalIdFrom(e.target.value)
                }}
              >
                <Input
                  name="fromNationalId"
                  label={formatMessage(m.fromNationalId)}
                  backgroundColor="blue"
                  type="tel"
                  errorMessage={formatMessage(
                    m[actionData?.errors?.fromNationalId as keyof typeof m],
                  )}
                  max={10}
                  required
                />
              </InputMask>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <InputMask
                // eslint-disable-next-line local-rules/disallow-kennitalas
                mask="999999-9999"
                maskPlaceholder={null}
                value={toNationalId || ''}
                onChange={(e) => {
                  setNationalIdTo(e.target.value)
                }}
              >
                <Input
                  name="toNationalId"
                  label={formatMessage(m.toNationalId)}
                  backgroundColor="blue"
                  type="tel"
                  errorMessage={formatMessage(
                    m[actionData?.errors?.fromNationalId as keyof typeof m],
                  )}
                  max={10}
                  required
                />
              </InputMask>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Select
                backgroundColor="white"
                label={formatMessage(m.type)}
                name="type"
                required
                noOptionsMessage="No options"
                defaultValue={{
                  label: 'Allsherjarumboð',
                  value: '0',
                }}
                options={[
                  {
                    label: 'Allsherjarumboð',
                    value: '0',
                  },
                  {
                    label: 'Mitt Island umboð',
                    value: '1',
                  },
                ]}
                placeholder={formatMessage(m.type)}
                size="md"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Checkbox
                label={formatMessage(m.validInfinite)}
                name="validInfinite"
                filled
                defaultChecked
                onChange={(e) => {
                  setValidInfinite(e.target.checked)
                }}
                value={validInfinite.toString()}

              />
            </GridColumn>
              {!validInfinite  && (
              <GridColumn span={['12/12', '12/12', '7/12']}>
                <DatePicker
                  name="validTo"
                  label={formatMessage(m.type)}
                  locale="is"
                  placeholderText={formatMessage(m.validTo)}
                  required
                />
              </GridColumn>
              )}
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Input
                name="referenceId"
                label={formatMessage(m.referenceId)}
                backgroundColor="blue"
                required
                errorMessage={formatMessage(
                  m[actionData?.errors?.referenceId as keyof typeof m],
                )}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
                <Button
                  onClick={() => navigate(DelegationAdminPaths.Root)}
                  variant="ghost"
                  type="button"
                >
                  {formatMessage(m.cancel)}
                </Button>
                <Button type="submit" loading={isLoading || isSubmitting}>
                  {formatMessage(m.create)}
                </Button>
              </Box>
            </GridColumn>
            {actionData?.globalError && (
              <GridColumn span={['12/12']}>
                <AlertMessage
                  title=""
                  message={formatMessage(m.errorDefault)}
                  type="error"
                />
              </GridColumn>
            )}
          </GridRow>
        </Form>
      </div>
    </Stack>
  )
}

export default CreateDelegationScreen
