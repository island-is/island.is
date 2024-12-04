import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { NationalIdWithName } from '@island.is/application/ui-components'
import { userInformation } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'

//TODOx hvernig hreinsum við gildi ef strokað er út nationalId
export const OtherContact: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, field } = props
  const { setValue, formState } = useFormContext()

  const [includeOtherContact, setIncludeOtherContact] = useState<boolean>(
    getValueViaPath<boolean>(application.answers, `${field.id}.include`) ||
      false,
  )

  const onClickAdd = () => {
    setIncludeOtherContact(true)
    setValue(`${field.id}.include`, true)
  }

  const onClickRemove = () => {
    setIncludeOtherContact(false)
    setValue(`${field.id}.include`, false)
  }

  return (
    <Box>
      {includeOtherContact && (
        <Box position="relative">
          <NationalIdWithName
            {...props}
            id={field.id}
            customNameLabel={userInformation.otherContact.name}
          />
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`${field.id}.email`}
                type="email"
                label={formatMessage(userInformation.otherContact.email)}
                backgroundColor="blue"
                required
                error={getErrorViaPath(formState.errors, `${field.id}.email`)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`${field.id}.phone`}
                type="tel"
                format="###-####"
                label={formatMessage(userInformation.otherContact.phone)}
                backgroundColor="blue"
                required
                error={getErrorViaPath(formState.errors, `${field.id}.phone`)}
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}

      <Box marginTop={2}>
        {!includeOtherContact && (
          <Button icon="add" onClick={() => onClickAdd()} variant="ghost" fluid>
            {formatMessage(userInformation.otherContact.addButtonLabel)}
          </Button>
        )}

        {includeOtherContact && (
          <Button
            icon="remove"
            onClick={() => onClickRemove()}
            variant="ghost"
            colorScheme="destructive"
            fluid
          >
            {formatMessage(userInformation.otherContact.removeButtonLabel)}
          </Button>
        )}
      </Box>
    </Box>
  )
}
