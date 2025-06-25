import { Box, Icon, Tooltip } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { FormSystemScreen, FormSystemField } from '@island.is/api/schema'
import { ControlContext } from '../../../context/ControlContext'
import { removeTypename } from '../../../lib/utils/removeTypename'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { CREATE_FIELD, CREATE_SCREEN } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { FieldTypesEnum } from '@island.is/form-system/enums'

interface Props {
  id: string
  type: 'Section' | 'Screen' | 'Field'
}

export const NavButtons = ({ id, type }: Props) => {
  const { control, controlDispatch } = useContext(ControlContext)
  const { form } = control
  const { screens, fields } = form
  const { formatMessage } = useIntl()
  const hoverText =
    type === 'Section'
      ? formatMessage(m.addScreenHover)
      : formatMessage(m.addFieldHover)

  const createScreen = useMutation(CREATE_SCREEN)
  const createField = useMutation(CREATE_FIELD)

  const addItem = async () => {
    if (type === 'Section') {
      const newScreen = await createScreen[0]({
        variables: {
          input: {
            createScreenDto: {
              sectionId: id,
              displayOrder: screens?.length,
            },
          },
        },
      })
      if (newScreen && !createScreen[1].loading) {
        controlDispatch({
          type: 'ADD_SCREEN',
          payload: {
            screen: removeTypename(
              newScreen.data?.createFormSystemScreen,
            ) as FormSystemScreen,
          },
        })
      }
    } else if (type === 'Screen') {
      const newField = await createField[0]({
        variables: {
          input: {
            createFieldDto: {
              screenId: id,
              fieldType: FieldTypesEnum.TEXTBOX,
              displayOrder: fields?.length ?? 0,
            },
          },
        },
      })
      if (newField) {
        controlDispatch({
          type: 'ADD_FIELD',
          payload: {
            field: removeTypename(
              newField.data?.createFormSystemField,
            ) as FormSystemField,
          },
        })
      }
    }
  }

  return (
    <Box display="flex" flexDirection="row">
      {type !== 'Field' && (
        <Box
          style={{ paddingTop: '5px', cursor: 'pointer' }}
          marginRight={1}
          onClick={(e) => {
            addItem()
            e.stopPropagation()
          }}
        >
          <Tooltip text={hoverText} color="yellow200">
            <span>
              <Icon icon="add" color="blue400" size="medium" />
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  )
}
