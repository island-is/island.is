import { useMutation } from '@apollo/client'
import { FormSystemField, FormSystemScreen } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { CREATE_FIELD, CREATE_SCREEN } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { Box, Icon, Tooltip } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../context/ControlContext'
import { removeTypename } from '../../../lib/utils/removeTypename'

interface Props {
  id: string
  type: 'Section' | 'Screen' | 'Field'
}

export const NavButtons = ({ id, type }: Props) => {
  const { control, controlDispatch, setOpenComponents } =
    useContext(ControlContext)
  const { form } = control
  const { sections, screens, fields } = form
  const { formatMessage } = useIntl()

  const hoverText =
    type === 'Section'
      ? formatMessage(m.addScreenHover)
      : formatMessage(m.addFieldHover)

  const createScreen = useMutation(CREATE_SCREEN)
  const createField = useMutation(CREATE_FIELD)

  const isPayment = (screenId: string) => {
    const screen = screens?.find((screen) => screen?.id === screenId)
    if (screen) {
      const section = sections?.find(
        (section) => section?.id === screen.sectionId,
      )
      if (section) {
        return section.sectionType === 'PAYMENT'
      }
    }
    return false
  }

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
        setOpenComponents((prev) => ({
          ...prev,
          sections: prev.sections.includes(id)
            ? prev.sections
            : [...prev.sections, id],
        }))
      }
    } else if (type === 'Screen') {
      const newField = await createField[0]({
        variables: {
          input: {
            createFieldDto: {
              screenId: id,
              fieldType: isPayment(id)
                ? FieldTypesEnum.PAYMENT
                : FieldTypesEnum.TEXTBOX,
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
        setOpenComponents((prev) => ({
          ...prev,
          screens: prev.screens.includes(id)
            ? prev.screens
            : [...prev.screens, id],
        }))
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
