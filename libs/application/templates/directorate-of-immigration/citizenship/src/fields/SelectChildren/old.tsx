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
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { MAX_CNT_APPLICANTS, ParentsToApplicant } from '../../shared'
import {
  DatePickerController,
  InputController,
  RadioController,
} from '@island.is/shared/form-fields'
import { NO, YES, getValueViaPath } from '@island.is/application/core'
import { IdentityInput, Query } from '@island.is/api/schema'
import { gql, useLazyQuery } from '@apollo/client'

import { IDENTITY_QUERY } from '../../graphql/queries'
import { useForm, useFormContext } from 'react-hook-form'
import { debounce } from 'lodash'

interface ChildrenCustodyResponseProps {
  nationalId: string
  fullCustody: boolean
  otherParentNationalId?: string
  otherParentName?: string
  otherParentBirthDate?: string
}

export const SelectChildren = ({ field, application, errors }: any) => {
  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()

  const {
    externalData: { childrenCustodyInformation },
    answers,
  } = application
  const children =
    childrenCustodyInformation.data as ApplicantChildCustodyInformation[]

  console.log('children', children)

  const [selectedChildren, setSelectedChildren] = useState<any[]>(
    getValueViaPath(answers, 'selectedChildren', []) as any[],
  )

  const [isVisible, setIsVisible] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [currentBirthDate, setCurrentBirthDate] = useState('')
  const [currentFullCustody, setCurrentFullCustody] = useState(true)

  const [childrenCustodyResponses, setChildrenCustodyResponses] = useState<
    Array<ChildrenCustodyResponseProps>
  >([])
  const [mostRecentlyCheckedChildIndex, setMostRecentlyCheckedChildIndex] =
    useState<number>(0)

  const [mostRecentlyCheckedChildSSN, setMostRecentlyCheckedChildSSN] =
    useState<string>('')

  const currentNameField = `selectedChildren[${mostRecentlyCheckedChildIndex}].otherParentName`

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

  const [numberOfChecked, setNumberOfChecked] = useState(0)
  const handleCheckboxChange = (length: number) => {
    setNumberOfChecked(length)
  }

  const [showMoreQuestions, setShowMoreQuestions] = useState(false)

  useEffect(() => {
    children.map((child) => {
      if (child.otherParent) {
        setChildrenCustodyResponses([
          ...childrenCustodyResponses,
          {
            nationalId: child.nationalId,
            fullCustody: false,
            otherParentName: child.otherParent.fullName,
            otherParentNationalId: child.otherParent.nationalId,
          },
        ])

        //TODO how do I add this to the selectedChildren afterwards? if the child is selected?
      }
    })

    selectedChildren.map((child: any) => {
      setChildrenCustodyResponses([...childrenCustodyResponses, child])
    })
  }, [])

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

  console.log('application', application)

  //Add the modal answers to form answers, need to do this this way because I reset the form afterwards to avoid multiple forms when many children
  const addAllAnswers = (
    index: number,
    ssn: string,
    otherParentSsn: string,
    otherParentName: string,
    otherParentBirthDate: string,
    fullCustody: boolean,
  ) => {
    setValue(`selectedChildren[${index}].nationalId`, ssn)
    setValue(`selectedChildren[${index}].otherParentNationalId`, otherParentSsn)
    setValue(`selectedChildren[${index}].otherParentName`, otherParentName)
    setValue(`selectedChildren[${index}].fullCustody`, fullCustody)
    setValue(
      `selectedChildren[${index}].otherParentBirtDate`,
      otherParentBirthDate,
    )
  }

  const submitModal = () => {
    addAllAnswers(
      mostRecentlyCheckedChildIndex,
      mostRecentlyCheckedChildSSN,
      nationalIdInput,
      currentName,
      currentBirthDate,
      currentFullCustody,
    )

    setChildrenCustodyResponses([
      ...childrenCustodyResponses,
      {
        nationalId: mostRecentlyCheckedChildSSN,
        fullCustody: currentFullCustody,
        otherParentName: currentName,
        otherParentNationalId: nationalIdInput,
        otherParentBirthDate: currentBirthDate,
      },
    ])

    //resetting the form and hiding the modal
    setMostRecentlyCheckedChildIndex(mostRecentlyCheckedChildIndex + 1)
    setNationalIdInput('')
    setCurrentBirthDate('')
    setCurrentName('')
    control._reset()
    setIsVisible(false)

    const currentAnswers = getValues()
    console.log('curerntAnswers', currentAnswers)
  }

  const { control } = useForm()

  return (
    <Box>
      <Box>
        <CheckboxFormField
          application={application}
          field={{
            id: `temp.nationalId`,
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
              //if the new answer includes ssn that has not been added to the children custody response array -> so still needs to be answered
              //only one item can be unanswered since this happens every time a child is selected and is never deleted from the response array
              const unansweredSSN = newAnswer.filter((x) => {
                return (
                  childrenCustodyResponses.filter((y) => y.nationalId === x)
                    .length === 0
                )
              })
              console.log('childrenCustodyResponses', childrenCustodyResponses)
              console.log('unsanswered', unansweredSSN)
              if (unansweredSSN[0]) {
                setIsVisible(true)
                setMostRecentlyCheckedChildSSN(unansweredSSN[0])
              }
              // //TODO fix counter
              // handleCheckboxChange(newAnswer.length)
            },
          }}
        />
      </Box>
      <ModalBase
        baseId="myDialog"
        isVisible={isVisible}
        backdropWhite
        onVisibilityChange={(visibility) => {
          if (visibility !== isVisible) {
            setIsVisible(visibility)
          }
        }}
      >
        <Box padding={4}>
          <Text>Ert þú með fulla forsjá?</Text>
          <RadioController
            id={`temp.hasFullCustody`}
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

          {showMoreQuestions && (
            <Box>
              <GridRow>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <InputController
                    control={control}
                    defaultValue={nationalIdInput}
                    id={`temp.otherparentssn`}
                    label={formatMessage(
                      personal.labels.userInformation.nationalId,
                    )}
                    format="######-####"
                    required={false}
                    onChange={debounce((v) => {
                      setNationalIdInput(v.target.value.replace(/\W/g, ''))
                    })}
                    loading={queryLoading}

                    // error={errors && getErrorViaPath(errors, nationaIdField)}
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <Input
                    name={`temp.otherParentName`}
                    value={currentName}
                    label={formatMessage(personal.labels.userInformation.name)}
                    readOnly={!!nationalIdInput}
                    onChange={(e) => setCurrentName(e.target.value)}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <DatePickerController
                    defaultValue={currentBirthDate}
                    id={`temp.otherParentBirtDate`}
                    label={formatMessage(
                      information.labels.staysAbroad.dateFromLabel,
                    )}
                    // error={errors && getErrorViaPath(errors, dateFromField)}
                    onChange={(value) => setCurrentBirthDate(value as string)}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          )}

          <Button onClick={submitModal} variant="text">
            Staðfesta
          </Button>
        </Box>
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
