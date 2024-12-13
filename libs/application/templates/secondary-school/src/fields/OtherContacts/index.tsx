import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { NationalIdWithName } from '@island.is/application/ui-components'
import { userInformation } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { getHasParent } from '../../utils'

export const OtherContacts: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, field } = props
  const { setValue, formState } = useFormContext()

  const hasParent = getHasParent(application.externalData, 0)

  const [includeOtherContactFirst, setIncludeOtherContactFirst] =
    useState<boolean>(
      getValueViaPath<boolean>(application.answers, `${field.id}[0].include`) ||
        false,
    )
  const [includeOtherContactSecond, setIncludeOtherContactSecond] =
    useState<boolean>(
      getValueViaPath<boolean>(application.answers, `${field.id}[1].include`) ||
        false,
    )

  const onClickAddFirst = () => {
    setIncludeOtherContactFirst(true)
    setValue(`${field.id}[0].include`, true)
  }
  const onClickRemoveFirst = () => {
    setIncludeOtherContactFirst(false)
    setValue(`${field.id}[0].include`, false)
  }

  const onClickAddSecond = () => {
    setIncludeOtherContactSecond(true)
    setValue(`${field.id}[1].include`, true)
  }
  const onClickRemoveSecond = () => {
    setIncludeOtherContactSecond(false)
    setValue(`${field.id}[1].include`, false)
  }

  // default set include for first and second other contact
  // if applicant has a parent, then first is optional and second is hidden (not available)
  // if applicant has no parent (applicant is over 18 years old), then first is required and second is optional
  useEffect(() => {
    if (hasParent) {
      setIncludeOtherContactSecond(false)

      // reset include for second other contact if for some reason
      // if is true and applicant has a parent
      const oldValue = getValueViaPath<boolean>(
        application.answers,
        `${field.id}[1].include`,
      )
      if (oldValue) setValue(`${field.id}[1].include`, false)
    }
    if (!hasParent) {
      setIncludeOtherContactFirst(true)
      setValue(`${field.id}[0].include`, true)
    }
  }, [application.answers, field.id, hasParent, setValue])

  return (
    <Box>
      {/* Other contact first */}
      {/* Required if has parent, optional if has no parent */}
      {hasParent && (
        <Text variant="h5" marginTop={3}>
          {formatMessage(userInformation.otherContact.subtitle)}
        </Text>
      )}
      {includeOtherContactFirst && (
        <Box position="relative">
          <NationalIdWithName
            {...props}
            id={`${field.id}[0]`}
            customNameLabel={userInformation.otherContact.name}
          />
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`${field.id}[0].email`}
                type="email"
                label={formatMessage(userInformation.otherContact.email)}
                backgroundColor="blue"
                required
                error={getErrorViaPath(
                  formState.errors,
                  `${field.id}[0].email`,
                )}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`${field.id}[0].phone`}
                type="tel"
                format="###-####"
                label={formatMessage(userInformation.otherContact.phone)}
                backgroundColor="blue"
                required
                error={getErrorViaPath(
                  formState.errors,
                  `${field.id}[0].phone`,
                )}
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}

      {/* Other contact second */}
      {/* Optional if has no parent, hidden if has parent */}
      {!hasParent && (
        <Text variant="h5" marginTop={3}>
          {formatMessage(userInformation.otherContact.subtitle)}
        </Text>
      )}
      {includeOtherContactSecond && (
        <Box position="relative">
          <NationalIdWithName
            {...props}
            id={`${field.id}[1]`}
            customNameLabel={userInformation.otherContact.name}
          />
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`${field.id}[1].email`}
                type="email"
                label={formatMessage(userInformation.otherContact.email)}
                backgroundColor="blue"
                required
                error={getErrorViaPath(
                  formState.errors,
                  `${field.id}[1].email`,
                )}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`${field.id}[1].phone`}
                type="tel"
                format="###-####"
                label={formatMessage(userInformation.otherContact.phone)}
                backgroundColor="blue"
                required
                error={getErrorViaPath(
                  formState.errors,
                  `${field.id}[1].phone`,
                )}
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}

      {hasParent ? (
        <Box marginTop={2}>
          {!includeOtherContactFirst && (
            <Button
              icon="add"
              onClick={() => onClickAddFirst()}
              variant="ghost"
              fluid
            >
              {formatMessage(userInformation.otherContact.addButtonLabel)}
            </Button>
          )}

          {includeOtherContactFirst && (
            <Button
              icon="remove"
              onClick={() => onClickRemoveFirst()}
              variant="ghost"
              colorScheme="destructive"
              fluid
            >
              {formatMessage(userInformation.otherContact.removeButtonLabel)}
            </Button>
          )}
        </Box>
      ) : (
        <Box marginTop={2}>
          {!includeOtherContactSecond && (
            <Button
              icon="add"
              onClick={() => onClickAddSecond()}
              variant="ghost"
              fluid
            >
              {formatMessage(userInformation.otherContact.addButtonLabel)}
            </Button>
          )}

          {includeOtherContactSecond && (
            <Button
              icon="remove"
              onClick={() => onClickRemoveSecond()}
              variant="ghost"
              colorScheme="destructive"
              fluid
            >
              {formatMessage(userInformation.otherContact.removeButtonLabel)}
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}
