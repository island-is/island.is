import { RepeaterProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../lib/oldAgePensionUtils'
import {
  AlertMessage,
  Box,
  Button,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { ChildPensionTable } from './table'
import * as kennitala from 'kennitala'
import { ChildPensionRow } from '../../types'
import { FieldDescription } from '@island.is/shared/form-fields'

export const ChildCustodyRepeater: FC<RepeaterProps> = ({
  application,
  expandRepeater,
  setRepeaterItems,
}) => {
  let editable = false
  const { formatMessage } = useLocale()
  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )
  const { childPension } = getApplicationAnswers(application.answers)
  const children = childPension

  // put custody info from national registry into data
  const data: ChildPensionRow[] = custodyInformation.map((info) => {
    return {
      name: info.fullName,
      nationalIdOrBirthDate: kennitala.format(info.nationalId),
      childDoesNotHaveNationalId: false,
      editable: false,
    }
  })

  // push manually added children to data
  children.forEach((child) => {
    const nationalIdOrBirthDate = child['childDoesNotHaveNationalId']
      ? new Date(child['nationalIdOrBirthDate']).toLocaleDateString()
      : kennitala.format(child['nationalIdOrBirthDate'])

    data.push({
      name: child['name'],
      nationalIdOrBirthDate: nationalIdOrBirthDate,
      childDoesNotHaveNationalId: child['childDoesNotHaveNationalId'],
      editable: true,
    })

    editable = true
  })

  const onDeleteChild = async (nationalIdOrBirthDate: string, name: string) => {
    const reducedChildren = children?.filter((child) =>
      child.childDoesNotHaveNationalId
        ? new Date(child.nationalIdOrBirthDate).toLocaleDateString() !==
            nationalIdOrBirthDate ||
          (new Date(child.nationalIdOrBirthDate).toLocaleDateString() ===
            nationalIdOrBirthDate &&
            child.name !== name)
        : kennitala.format(child.nationalIdOrBirthDate) !==
          nationalIdOrBirthDate,
    )

    await setRepeaterItems(reducedChildren)
  }

  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          oldAgePensionFormMessage.connectedApplications
            .childPensionDescription,
        )}
      />
      {data.length > 0 ? (
        <>
          {/* veit ekki með þetta tékk?! finnst bara skrítið að hafa börn í þinni forsjá, þegar engin börn
          fundust en bætt var við börnum. En ef börn fundust í þinni forsjá OG þú bætir við börnum - hver á þá
          textinn að vera??? */}
          {editable ? (
            <>
              <Text variant="h4" as="h4" paddingTop={5}>
                {formatMessage(
                  oldAgePensionFormMessage.connectedApplications
                    .noChildPensionFoundTableTitle,
                )}
              </Text>
              <Text variant="small">
                {formatMessage(
                  oldAgePensionFormMessage.connectedApplications
                    .noChildPensionFoundTableDescription,
                )}
              </Text>
            </>
          ) : (
            <>
              <Text variant="h4" as="h4" paddingTop={5}>
                {formatMessage(
                  oldAgePensionFormMessage.connectedApplications
                    .childPensionTableTitle,
                )}
              </Text>
              <Text variant="small">
                {formatMessage(
                  oldAgePensionFormMessage.connectedApplications
                    .childPensionTableDescription,
                )}
              </Text>
            </>
          )}
          <Box paddingTop={5} paddingBottom={5}>
            <ChildPensionTable
              children={data}
              editable={editable}
              onDeleteChild={onDeleteChild}
            />
          </Box>
        </>
      ) : (
        <Box paddingTop={5} paddingBottom={5}>
          <AlertMessage
            type="warning"
            title={formatMessage(
              oldAgePensionFormMessage.connectedApplications.noChildFoundTitle,
            )}
            message={formatMessage(
              oldAgePensionFormMessage.connectedApplications
                .noChildFoundDescription,
            )}
          />
        </Box>
      )}
      <Box alignItems="center">
        <Inline space={1} alignY="center">
          <Button size="small" icon="add" onClick={expandRepeater}>
            {formatMessage(
              oldAgePensionFormMessage.connectedApplications.addChildButton,
            )}
          </Button>
        </Inline>
      </Box>
    </Box>
  )
}

export default ChildCustodyRepeater
