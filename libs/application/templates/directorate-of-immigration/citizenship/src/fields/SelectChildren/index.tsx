import {
  AlertMessage,
  Box,
  Button,
  ModalBase,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { information, selectChildren } from '../../lib/messages'
import {
  ApplicantChildCustodyInformation,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { MAX_CNT_APPLICANTS } from '../../shared'
import { RadioController } from '@island.is/shared/form-fields'
import { NO, YES } from '@island.is/application/core'

export const SelectChildren = ({ field, application, error }: any) => {
  const { formatMessage } = useLocale()

  const {
    externalData: { childrenCustodyInformation },
    answers,
  } = application
  const children =
    childrenCustodyInformation.data as ApplicantChildCustodyInformation[]

  console.log('children', children)

  const [isVisible, setIsVisible] = useState(true)
  const [mostRecentlyCheckedChildSSN, setMostRecentlyCheckedChildSSN] =
    useState<string>('')
  const [mostRecentlyCheckedChildIndex, setMostRecentlyCheckedChildIndex] =
    useState<number>()

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

  const handleCustodyRadio = (childSSN: string, value: string) => {}

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
              console.log('newAnswer', newAnswer)
              handleCheckboxChange(newAnswer.length)
              return { ...answers, selectedChildren: newAnswer }
            },
          }}
        />
      </Box>
      <ModalBase
        baseId="myDialog"
        isVisible={isVisible}
        onVisibilityChange={(visibility) => {
          if (visibility !== isVisible) {
            setIsVisible(visibility)
          }
        }}
      >
        {({ closeModal }) => (
          <Box padding={4}>
            <Text>We use onVisibilityChange to keep isVisible in sync</Text>
            <RadioController
              id={`selectedChildren[${mostRecentlyCheckedChildIndex}].showOtherParent`}
              split="1/2"
              onSelect={(value) => {
                handleCustodyRadio(mostRecentlyCheckedChildSSN, value)
              }}
              defaultValue={false}
              options={[
                {
                  value: YES,
                  label: formatMessage(
                    information.labels.radioButtons.radioOptionYes,
                  ),
                },
                {
                  value: NO,
                  label: formatMessage(
                    information.labels.radioButtons.radioOptionNo,
                  ),
                },
              ]}
            />

            <Button onClick={closeModal} variant="text">
              Close modal
            </Button>
          </Box>
        )}
      </ModalBase>
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
