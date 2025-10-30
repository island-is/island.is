import {
  FieldBaseProps,
  NationalRegistryParent,
} from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { information } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  getErrorViaPath,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { ParentsToApplicant } from '../../shared'
import { ParentRepeaterItem } from './ParentRepeaterItem'

export const Parents: FC<FieldBaseProps> = ({ field, application, errors }) => {
  const { externalData, answers } = application

  const nationalRegistryParents = externalData.nationalRegistryParents as {
    data: NationalRegistryParent[]
  }

  const [hasValidParents, setHasValidParents] = useState(
    getValueViaPath(answers, 'parentInformation.hasValidParents', '') as string,
  )

  //This is used to determine weather parent information comes from answer or national registry, to determine if the column is read only or not
  const parentsFoundFromAnswer: '0' | '1' | '2' =
    nationalRegistryParents.data.length === 1
      ? '1'
      : nationalRegistryParents.data.length === 2
      ? '2'
      : '0'

  const [parents, setParents] = useState<ParentsToApplicant[]>(
    getValueViaPath(
      answers,
      'parentInformation.parents',
      nationalRegistryParents.data.map((x: NationalRegistryParent) => {
        return { ...x, wasRemoved: 'false' }
      }) as ParentsToApplicant[],
    ) as ParentsToApplicant[],
  )

  const { formatMessage } = useLocale()

  useEffect(() => {
    const validParents = parents.filter(
      (x) => x.nationalId && x.nationalId !== '',
    )

    const defaultParents = [
      {
        nationalId: '',
        fullName: '',
        wasRemoved: 'false',
        currentName: '',
      },
      {
        nationalId: '',
        fullName: '',
        wasRemoved: 'true',
        currentName: '',
      },
    ]

    //if the user has answered YES previously and is returning to the step and has one valid parent from previous answers
    //set the valid parent and set the second as default wasRemoved=true
    if (hasValidParents === YES) {
      if (validParents.length === 1)
        setParents([...validParents, { ...defaultParents[1] }])
    } else {
      setParents([defaultParents[1], defaultParents[1]])
    }
  }, [])

  const addParentToApplication = (newIndex: number) => {
    setParents(
      parents.map((parent, index) => {
        if (newIndex === index) {
          const a = { ...parent, wasRemoved: 'false' }
          return a
        }
        return parent
      }),
    )
  }

  const handleRemoveAll = () => {
    setParents(
      parents.map((p) => {
        return { ...p, wasRemoved: 'true' }
      }),
    )
  }

  const handleToggleYes = () => {
    setParents(
      parents.map((p, index) => {
        if (index === 0) {
          return { ...p, wasRemoved: 'false' }
        } else return p
      }),
    )
  }

  const handleValidParentsChange = (value: string) => {
    setHasValidParents(value)
    if (value === NO) {
      handleRemoveAll()
    } else {
      handleToggleYes()
    }
  }

  return (
    <Box>
      <RadioController
        id={'parentInformation.hasValidParents'}
        split="1/2"
        onSelect={(value) => {
          handleValidParentsChange(value)
        }}
        defaultValue={hasValidParents}
        options={[
          {
            value: YES,
            label: formatMessage(
              information.labels.radioButtons.radioOptionYes,
            ),
          },
          {
            value: NO,
            label: formatMessage(information.labels.radioButtons.radioOptionNo),
          },
        ]}
        error={
          errors && getErrorViaPath(errors, 'parentInformation.hasValidParents')
        }
      />

      {!!parents &&
        parents.map((parent, index) => {
          const position = parents.indexOf(parent)
          return (
            <ParentRepeaterItem
              key={`parentBox${index}`}
              index={index}
              field={field}
              application={application}
              errors={errors}
              itemNumber={position}
              isRequired={parent.wasRemoved === 'false' && index === 0}
              repeaterField={parent}
              readOnly={
                (parent.nationalId &&
                  parent.nationalId !== '' &&
                  ((index === 0 && parentsFoundFromAnswer === '1') ||
                    parentsFoundFromAnswer === '2')) ||
                (index === 1 && parentsFoundFromAnswer === '2')
                  ? true
                  : false
              }
              addParentToApplication={addParentToApplication}
              isHidden={hasValidParents !== YES}
            />
          )
        })}
    </Box>
  )
}
