import { FC } from 'react'
import { formatText } from '@island.is/application/core'
import {
  Box,
  GridRow,
  GridColumn,
  AlertMessage,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { getApplicationExternalData } from '../../../lib/childPensionUtils'

interface ParentsPenitentiaryProps {
  id: string
  application: Application
}

const ParentsPenitentiary: FC<
  React.PropsWithChildren<ParentsPenitentiaryProps>
> = ({ id, application }) => {
  const { formatMessage } = useLocale()

  const parentsPenitentiaryFieldId = id.replace('reason', 'parentsPenitentiary')
  const nameFieldId = `${parentsPenitentiaryFieldId}.name`
  const nationalIdFieldId = `${parentsPenitentiaryFieldId}.nationalId`

  const { hasSpouse, spouseName, spouseNationalId } =
    getApplicationExternalData(application.externalData)

  return (
    <Box marginTop={2}>
      {hasSpouse ? (
        <GridRow>
          <GridColumn span="1/2">
            <InputController
              id={nationalIdFieldId}
              placeholder="000000-0000"
              label={formatText(
                childPensionFormMessage.info
                  .childPensionParentsPenitentiaryNationalId,
                application,
                formatMessage,
              )}
              defaultValue={spouseNationalId}
              format="######-####"
              backgroundColor="blue"
              disabled
            />
          </GridColumn>
          <GridColumn span="1/2">
            <InputController
              id={nameFieldId}
              label={formatText(
                childPensionFormMessage.info.registerChildFullName,
                application,
                formatMessage,
              )}
              defaultValue={spouseName}
              backgroundColor="blue"
              disabled
            />
          </GridColumn>
        </GridRow>
      ) : (
        <AlertMessage
          type="error"
          title={formatMessage(
            childPensionFormMessage.info.childPensionNameAlertTitle,
          )}
          message={formatMessage(
            childPensionFormMessage.info
              .childPensionParentsPenitentiaryNoSpouse,
          )}
        />
      )}
    </Box>
  )
}

export default ParentsPenitentiary
