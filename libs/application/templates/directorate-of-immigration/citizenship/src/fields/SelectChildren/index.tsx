import { AlertMessage, Box, Tag } from '@island.is/island-ui/core'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { selectChildren } from '../../lib/messages'
import {
  ApplicantChildCustodyInformation,
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { MAX_CNT_APPLICANTS } from '../../shared'

export const SelectChildren: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const {
    externalData: { childrenCustodyInformation },
    answers,
  } = application
  const children =
    childrenCustodyInformation.data as ApplicantChildCustodyInformation[]

  const childrenCheckboxes = children.map(
    (child: ApplicantChildCustodyInformation) => {
      const showForeignDomicileTag = !child.domicileInIceland
      const isCheckable =
        child.domicileInIceland && child.citizenship?.code !== 'IS'

      return {
        value: child.nationalId,
        label: `${child.givenName} ${child.familyName}`,
        subLabel: child.otherParent
          ? `${formatMessage(selectChildren.checkboxes.subLabel)} ${
              child.otherParent?.fullName
            }`
          : '',
        rightContent: (
          <div style={{ display: 'flex' }}>
            {showForeignDomicileTag && (
              <div style={{ paddingRight: 15 }}>
                <Tag disabled variant="red">
                  {formatMessage(
                    selectChildren.checkboxes.tagLegalDomicileNotIceland,
                  )}
                </Tag>
              </div>
            )}
            <Tag
              outlined={child.citizenship?.code === 'IS' ? false : true}
              disabled
              variant={child.citizenship?.code === 'IS' ? 'red' : 'blue'}
            >
              {formatMessage(selectChildren.checkboxes.tagCitizenship, {
                citizenship: child.citizenship?.name,
              })}
            </Tag>
          </div>
        ),
        disabled: !isCheckable,
      }
    },
  )

  const [numberOfChecked, setNumberOfChecked] = useState(0)
  const handleCheckboxChange = (length: number) => {
    setNumberOfChecked(length)
  }

  return (
    <Box>
      <Box>
        <CheckboxFormField
          application={application}
          field={{
            id: field.id,
            title: 'Children',
            large: true,
            backgroundColor: 'blue',
            width: 'full',
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            children: undefined,
            options: childrenCheckboxes,
            onSelect: (newAnswer) => {
              handleCheckboxChange(newAnswer.length)
              return { ...answers, selectedChildren: newAnswer }
            },
          }}
        />
      </Box>

      {numberOfChecked > MAX_CNT_APPLICANTS && (
        <Box paddingBottom={1}>
          <AlertMessage
            type="error"
            title="TODO: Ekki hægt"
            message="TODO: Ekki hægt að sækja um fyrir svona mörg börn"
          />
        </Box>
      )}
    </Box>
  )
}
