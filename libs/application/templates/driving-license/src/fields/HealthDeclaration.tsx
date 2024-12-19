import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Text,
  GridRow,
  GridColumn,
  Stack,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  NO,
  YES,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { healthDeclarationQuestions } from '../lib/constants'
import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { useFormContext } from 'react-hook-form'

const HealthDeclaration: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()
  const hasError = errors ? getErrorViaPath(errors, 'healthDeclaration') : false

  const HealthDeclarationQuestion = ({
    id,
    label,
  }: {
    id: string
    label: MessageDescriptor
  }) => {
    return (
      <GridRow>
        <GridColumn span={['12/12', '8/12']} paddingBottom={1}>
          <Text>{formatMessage(label)}</Text>
        </GridColumn>
        <GridColumn span={['8/12', '3/12']} offset={['0', '1/12']}>
          <RadioController
            id={id}
            split="1/2"
            smallScreenSplit="1/2"
            defaultValue={
              (getValueViaPath(application.answers, id) as string[]) ??
              undefined
            }
            largeButtons={false}
            options={[
              {
                label: formatMessage(m.yes),
                value: YES,
              },
              {
                label: formatMessage(m.no),
                value: NO,
              },
            ]}
            onSelect={() => {
              clearErrors('healthDeclaration')
            }}
          />
        </GridColumn>
      </GridRow>
    )
  }

  return (
    <Box>
      <Text variant="h4" marginBottom={3}>
        {formatMessage(m.healthDeclarationMultiFieldSubTitle)}
      </Text>

      <Stack space={2}>
        {healthDeclarationQuestions.map(
          (question: { id: string; label: MessageDescriptor }) => (
            <HealthDeclarationQuestion
              key={question.id}
              id={question.id}
              label={question.label}
            />
          ),
        )}
      </Stack>

      {hasError && (
        <Box marginTop={3}>
          <AlertMessage type="error" title="" message="test" />
        </Box>
      )}
    </Box>
  )
}

export default HealthDeclaration
