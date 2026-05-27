import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  GridRow as Row,
  Input,
  Stack,
  Blockquote,
  Text,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { useUserInfo } from '@island.is/react-spa/bff'

export const ListFromUrl = () => {
  const { control, controlDispatch, setFocus, focus, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem, isReadOnly, form } = control
  const currentItem = activeItem.data as FormSystemField
  const userInfo = useUserInfo()

  const exampleRequest = {
    slug: form.slug,
    identifier: currentItem.identifier,
    loggedInUserNationalId:
      userInfo?.profile?.actor?.nationalId ?? '0000000000',
    applicantNationalId: userInfo?.profile?.nationalId ?? '0000000000',
    isTest: !form.beenPublished,
    fieldType: currentItem.fieldType,
  }
  const json = JSON.stringify(exampleRequest, null, 2)

  const exampleResponse = {
    list: [
      {
        label: {
          is: 'Listaval 1',
          en: 'List selection 1',
        },
        value: '',
        isSelected: false,
      },
    ],
  }
  const jsonResponse = JSON.stringify(exampleResponse, null, 2)

  // TODO Bæta við dropdownlista sem birtir öll fields frá fyrsta skjá fram að currentScreen
  // og leyfa að bæta við í request body. þar verður listi af identifierum fyrir þau field sem eru valin.
  // svo þegar við gerum request úr umsókn þá sendum við með þau gildi hvers identifiers
  // dropdown listinn ætti hafa svona línur
  // Section | Screen | Field name (Identifier)

  return (
    <Stack space={2}>
      <Row>
        <Column span="10/10">
          <Input
            label="X-Road slóð fyrir GET"
            name="dataSourceUrl"
            placeholder="/r1/IS/..."
            type="text"
            value={
              currentItem.fieldSettings?.dataSourceUrl
                ? String(currentItem.fieldSettings.dataSourceUrl)
                : ''
            }
            backgroundColor="blue"
            readOnly={isReadOnly}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'dataSourceUrl',
                  value: e.target.value,
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Text variant="small">Request body:</Text>
          <Blockquote>
            <Text variant="small" whiteSpace="preWrap" lineHeight="sm">
              <code>{json}</code>
            </Text>
          </Blockquote>
        </Column>
        <Column>
          <Text variant="small">Response body:</Text>
          <Blockquote>
            <Text variant="small" whiteSpace="preWrap" lineHeight="sm">
              <code>{jsonResponse}</code>
            </Text>
          </Blockquote>
        </Column>
      </Row>
    </Stack>
  )
}
