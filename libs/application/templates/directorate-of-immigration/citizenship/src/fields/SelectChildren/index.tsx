import * as kennitala from 'kennitala'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  ModalBase,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { information, personal, selectChildren } from '../../lib/messages'
import {
  ApplicantChildCustodyInformation,
  FieldComponents,
  FieldTypes,
  NO,
  YES,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { MAX_CNT_APPLICANTS } from '../../shared'
import { getValueViaPath } from '@island.is/application/core'
import {
  DatePickerController,
  InputController,
  RadioController,
} from '@island.is/shared/form-fields'
import { useForm, useFormContext } from 'react-hook-form'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql/queries'
import { debounce } from 'lodash'
import { HiddenTextInput } from '../HiddenTextInput'
import { id } from 'date-fns/locale'

interface ChildrenCustodyResponseProps {
  nationalId: string
  fullCustody: boolean
  otherParentNationalId?: string
  otherParentName?: string
  otherParentBirthDate?: string
}

export const SelectChildren = ({ field, application, error }: any) => {
  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()

  const {
    externalData: { childrenCustodyInformation },
    answers,
  } = application
  const children =
    childrenCustodyInformation.data as ApplicantChildCustodyInformation[]

  const [selectedChildren, setSelectedChildren] = useState<any[]>(
    getValueViaPath(answers, 'selectedChildren', []) as any[],
  )

  const [mostRecentlyCheckedChildSSN, setMostRecentlyCheckedChildSSN] =
    useState<string>('')

  const [mostRecentlyCheckedChildIndex, setMostRecentlyCheckedChildIndex] =
    useState<number>(0)

  const [isVisible, setIsVisible] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [currentBirthDate, setCurrentBirthDate] = useState('')
  const [currentFullCustody, setCurrentFullCustody] = useState(true)
  const [showMoreQuestions, setShowMoreQuestions] = useState(false)
  const [childrenCustodyResponses, setChildrenCustodyResponses] = useState<
    Array<ChildrenCustodyResponseProps>
  >([])
  const currentNameField = `selectedChildrenExtraData[${mostRecentlyCheckedChildIndex}].otherParentName`

  const { control } = useForm()

  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(
      gql`
        ${IDENTITY_QUERY}
      `,
      {
        onCompleted: (data) => {
          // setValue(givenNameField, data.identity?.givenName ?? undefined)
          // setValue(familyNameField, data.identity?.familyName ?? undefined)
          const currentName = `${data.identity?.givenName} ${data.identity?.familyName}`
          setCurrentName(currentName)
          setValue(currentNameField, currentName)
        },
      },
    )

  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }

    // const givenName = getValueViaPath(
    //   application.answers,
    //   givenNameField,
    //   '',
    // ) as string

    // const familyName = getValueViaPath(
    //   application.answers,
    //   familyNameField,
    //   '',
    // ) as string

    // if (!!givenName && !!familyName)
    //   setCurrentName(`${givenName} ${familyName}`)

    // if (nationalIdInput === '' && !isRequired) {
    //   setValue(wasRemovedField, 'true')
    //   setCurrentName('')
    //   setValue(currentNameField, '')
    // } else {
    //   setValue(wasRemovedField, 'false')
    // }
  }, [nationalIdInput, getIdentity])

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

  childrenCheckboxes.push({
    value: '1709922379',
    label: `asdf`,
    subLabel: '',
    disabled: false,
    rightContent: <div></div>,
  })

  const handleCustodyRadio = (childSSN: string, value: string) => {
    //if the parent has full custody, no more questions need to be asked
    if (value === 'yes') {
      setCurrentFullCustody(true)
      setShowMoreQuestions(false)
    }
    //if the parents does not have full custody, they need to fill out information about the other parent
    else {
      setCurrentFullCustody(false)
      setShowMoreQuestions(true)
    }
  }

  const [numberOfChecked, setNumberOfChecked] = useState(0)
  const handleCheckboxChange = (length: number) => {
    setNumberOfChecked(length)
  }

  const updateValues = (
    index: number,
    ssn: string,
    otherParentSsn: string,
    otherParentName: string,
    fullCustody: boolean,
  ) => {
    setValue(`selectedChildren[${index}].nationalId`, ssn)
    setValue(`selectedChildren[${index}].otherParentNationalId`, otherParentSsn)
    setValue(`selectedChildren[${index}].otherParentName`, otherParentName)
    setValue(`selectedChildren[${index}].fullCustody`, fullCustody)

    const currentAnswers = getValues()
    console.log('curerntAnswers', currentAnswers)
  }

  useEffect(() => {
    const currentAnswers = getValues()
    console.log('curerntAnswers', currentAnswers)
  }, [setValue])

  const submitModal = () => {
    updateValues(
      mostRecentlyCheckedChildIndex,
      mostRecentlyCheckedChildSSN,
      nationalIdInput,
      currentName,
      currentFullCustody,
    )
    setIsVisible(false)
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
              // console.log('newAnswer', newAnswer)
              // const unansweredSSN = newAnswer.filter((x) => {
              //   return (
              //     childrenCustodyResponses.filter((y) => y.nationalId === x)
              //       .length === 0
              //   )
              // })
              // if (unansweredSSN[0]) {
              //   setIsVisible(true)
              //   setMostRecentlyCheckedChildSSN(unansweredSSN[0])
              // }
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
function setValue(currentNameField: any, currentName: string) {
  throw new Error('Function not implemented.')
}
