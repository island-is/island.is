import { NationalRegistryParent } from '@island.is/application/types'
import { useEffect, useState } from 'react'
import { personal, information } from '../../lib/messages'
import DescriptionText from '../../components/DescriptionText'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { NationalIdWithName } from '../NationalIdWithName'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  getErrorViaPath,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { ParentsToApplicant } from '../../shared'
import { useFormContext } from 'react-hook-form'
import { ParentRepeaterItem } from './ParentRepeaterItem'

export const Parents = ({ field, application, errors }: any) => {
  const {
    externalData: { nationalRegistryParents },
    answers,
  } = application

  const [hasValidParents, setHasValidParents] = useState(
    getValueViaPath(answers, 'parentInformation.hasValidParents') as string,
  )

  const defaultParents = [
    { nationalId: '', name: '', wasRemoved: 'false' },
    { nationalId: '', name: '', wasRemoved: 'true' },
  ]

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
    if (validParents.length === 0) {
      setParents(defaultParents)
    }
    if (validParents.length === 1) {
      setParents([...validParents, { ...defaultParents[1] }])
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
        defaultValue={hasValidParents ? YES : NO}
        options={[
          {
            value: YES,
            label: formatMessage(
              information.labels.radioButtons.radioOptionYes,
            ),
          },
          {
            value: YES,
            label: formatMessage(information.labels.radioButtons.radioOptionNo),
          },
        ]}
      />

      {!!parents &&
        parents.map((parent, index) => {
          const position = parents.indexOf(parent)
          console.log('rendering loop')
          return (
            <ParentRepeaterItem
              index={index}
              field={field}
              application={application}
              errors={errors}
              itemNumber={position}
              isRequired={index === 0}
              repeaterField={parent}
              readOnly={
                parent.nationalId && parent.nationalId !== '' ? true : false
              }
              addParentToApplication={addParentToApplication}
              isHidden={hasValidParents === NO}
            />
          )
        })}
    </Box>
  )
}
