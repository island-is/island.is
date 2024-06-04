import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { FC, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'
import { information } from '../../lib/messages'
import {
  StudentTrackDto,
  StudentTrackInstitutionDto,
} from '@island.is/clients/university-careers'
import { MessageDescriptor } from 'react-intl'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface Message {
  id: string
  defaultMessage: string
  description: string
}

interface PermitProgram {
  name?: string
  programId?: string
  institution?: StudentTrackInstitutionDto
  error?: boolean
  errorMsg?: Message | string
  professionId?: string
  prereq?: StudentTrackDto // TODO Probably don't need this
}

export const SelectWorkPermitField: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { lang, formatMessage } = useLocale()
  const { application } = props

  const workPermitOptions = (workPermits: PermitProgram[]) => {
    const options: Option[] = []

    for (const permitProgram of workPermits) {
      const disabled = permitProgram.error
      const formattedErrorMsg = formatMessage(
        permitProgram.errorMsg as MessageDescriptor,
      )

      options.push({
        value: `${permitProgram.name}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {`${lang === 'is' ? permitProgram.name : permitProgram.name}${
                  disabled ? ` (${formattedErrorMsg})` : ''
                }`}
              </Text>
            </Box>
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  useEffect(() => {
    props.setSubmitButtonDisabled && props.setSubmitButtonDisabled(true)
  }, [])

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
        id={`${props.field.id}.name`}
        backgroundColor="blue"
        defaultValue={[]}
        options={workPermitOptions(
          application.externalData.permitOptions.data as PermitProgram[],
        )}
        onSelect={() =>
          props.setSubmitButtonDisabled && props.setSubmitButtonDisabled(false)
        }
      />
    </Box>
  )
}
