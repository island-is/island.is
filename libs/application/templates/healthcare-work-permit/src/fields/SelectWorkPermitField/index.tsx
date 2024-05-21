import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'
import { information } from '../../lib/messages'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export const SelectWorkPermitField: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { lang, formatMessage } = useLocale()
  const { application } = props

  const workPermitOptions = (workPermits: any) => {
    const options: Option[] = []

    for (const workPermit of workPermits.transcripts ?? []) {
      const disabled = false

      options.push({
        value: `${workPermit.studyProgram}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {lang === 'is'
                  ? workPermit.studyProgram
                  : workPermit.studyProgram}
              </Text>
            </Box>
            {disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.selectWorkPermit.restrictionAlertTitle,
                  )}
                  message={
                    <Box component="span" display="block">
                      <Text variant="small">
                        {formatMessage(
                          information.labels.selectWorkPermit
                            .restrictionAlertMessage,
                        )}
                      </Text>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return (
    <Box
      paddingTop={2}
      display={'flex'}
      flexDirection={'column'}
      style={{ gap: '24px' }}
    >
      <Text variant="h5">
        {formatMessage(information.labels.selectWorkPermit.sectionTitle)}
      </Text>
      <RadioController
        id={`${props.field.id}.studyProgram`}
        error={props.error as any} // TODO ?
        backgroundColor="blue"
        defaultValue={[]}
        options={workPermitOptions(
          application?.externalData?.universityOfIceland?.data as any,
        )}
      />
    </Box>
  )
}
