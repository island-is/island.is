import { FormSystemField } from '@island.is/api/schema'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  GET_ORGANIZATION_ZENDESK_INSTANCE,
  UPDATE_ORGANIZATION_ZENDESK_INSTANCE,
} from '@island.is/form-system/graphql'
import { FieldTypesEnum, ListTypesEnum } from '@island.is/form-system/enums'
import { m } from '@island.is/form-system/ui'
import {
  Button,
  GridColumn as Column,
  GridRow as Row,
  Input,
  RadioButton,
  Select,
  Stack,
  Blockquote,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { ListFromUrl } from './ListFromUrl'

type ZendeskInstanceConfig = {
  serviceSystemInstance: string
  serviceSystemBrandID: string
}

export const ListSettings = () => {
  const {
    control,
    setInListBuilder,
    controlDispatch,
    setFocus,
    focus,
    updateActiveItem,
  } = useContext(ControlContext)
  const { activeItem, isReadOnly, form } = control
  const currentItem = activeItem.data as FormSystemField
  const [isCustom, setIsCustom] = useState(
    !currentItem.fieldSettings?.listType ||
      currentItem.fieldSettings?.listType === ListTypesEnum.CUSTOM,
  )
  const [getZendeskInstance] = useLazyQuery(GET_ORGANIZATION_ZENDESK_INSTANCE, {
    fetchPolicy: 'no-cache',
  })
  const [updateOrganizationZendeskInstance] = useMutation(
    UPDATE_ORGANIZATION_ZENDESK_INSTANCE,
  )

  const { formatMessage } = useLocale()

  const predeterminedLists = [
    { label: 'Landalisti', value: ListTypesEnum.COUNTRIES },
    { label: 'Sveitarfélög', value: ListTypesEnum.MUNICIPALITIES },
    { label: 'Póstnúmer', value: ListTypesEnum.POSTAL_CODES },
    { label: 'Gjaldmiðlar', value: ListTypesEnum.CURRENCIES },
    ...(form?.submissionServiceUrl !== 'zendesk'
      ? [{ label: 'Listi frá slóð', value: ListTypesEnum.LIST_FROM_URL }]
      : []),
    {
      label: 'Zendesk forhlaðinn listi',
      value: ListTypesEnum.ZENDESK_FIELD_OPTIONS,
    },
    {
      label: 'Zendesk sérsniðinn hlutur',
      value: ListTypesEnum.ZENDESK_CUSTOM_OBJECT,
    },
  ]

  const selectedPredetermined =
    predeterminedLists.find(
      (o) => o.value === currentItem.fieldSettings?.listType,
    ) ?? null

  const selectCustomRadio = () => {
    if (isReadOnly) return
    setIsCustom(true)
    controlDispatch({
      type: 'SET_LIST_TYPE',
      payload: { listType: ListTypesEnum.CUSTOM, update: updateActiveItem },
    })
  }

  const selectPredeterminedRadio = () => {
    if (isReadOnly) return
    setIsCustom(false)
  }

  const updateZendeskInstance = async () => {
    const data = await getZendeskInstance({
      variables: {
        input: { nationalId: form.organizationNationalId },
      },
    })
    const zendeskInstanceInfo =
      data?.data?.formSystemOrganizationZendeskInstance
    const parsed: ZendeskInstanceConfig = JSON.parse(zendeskInstanceInfo)

    if (
      parsed.serviceSystemInstance !==
        form.organizationZendeskInstance?.zendeskInstance ||
      parsed.serviceSystemBrandID !==
        form.organizationZendeskInstance?.zendeskBrandId
    ) {
      controlDispatch({
        type: 'CHANGE_ORGANIZATION_ZENDESK_INSTANCE',
        payload: {
          zendeskInstance: parsed.serviceSystemInstance,
          zendeskBrandId: parsed.serviceSystemBrandID,
        },
      })
      await updateOrganizationZendeskInstance({
        variables: {
          input: {
            zendeskInstance: parsed.serviceSystemInstance,
            zendeskBrandId: parsed.serviceSystemBrandID,
            organizationId: form.organizationId,
          },
        },
      })
    }
  }

  return (
    <Stack space={2}>
      {currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <>
          <Column span="3/10">
            <RadioButton
              id="listType-custom"
              name="listTypeMode"
              label={formatMessage(m.customList)}
              disabled={isReadOnly}
              checked={isCustom}
              onChange={selectCustomRadio}
            />
          </Column>
          <Column span="3/10">
            <RadioButton
              id="listType-predetermined"
              name="listTypeMode"
              label={formatMessage(m.predeterminedLists)}
              disabled={isReadOnly}
              checked={!isCustom}
              onChange={selectPredeterminedRadio}
            />
          </Column>
        </>
      )}
      {isCustom && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          {formatMessage(m.listBuilder)}
        </Button>
      )}
      {!isCustom && (
        <>
          <Row>
            <Column span="5/10">
              <Select
                placeholder={formatMessage(m.chooseListType)}
                name="predeterminedLists"
                label={formatMessage(m.predeterminedLists)}
                options={predeterminedLists}
                value={selectedPredetermined}
                isDisabled={isReadOnly}
                backgroundColor="blue"
                onChange={(option) => {
                  controlDispatch({
                    type: 'SET_LIST_TYPE',
                    payload: {
                      listType: option?.value ?? ListTypesEnum.CUSTOM,
                      update: updateActiveItem,
                    },
                  })
                  if (
                    option?.value === ListTypesEnum.ZENDESK_FIELD_OPTIONS ||
                    option?.value === ListTypesEnum.ZENDESK_CUSTOM_OBJECT
                  ) {
                    updateZendeskInstance()
                  }
                }}
              />
            </Column>
            {currentItem.fieldSettings?.listType ===
              ListTypesEnum.ZENDESK_FIELD_OPTIONS && (
              <Column span="5/10">
                <Input
                  label="Zendesk ticket field ID"
                  name="zendeskTicketFieldId"
                  type="text"
                  value={
                    currentItem.fieldSettings?.zendeskTicketFieldId
                      ? String(currentItem.fieldSettings.zendeskTicketFieldId)
                      : ''
                  }
                  backgroundColor="blue"
                  readOnly={isReadOnly}
                  onChange={(e) => {
                    controlDispatch({
                      type: 'SET_ANY_FIELD_SETTING',
                      payload: {
                        property: 'zendeskTicketFieldId',
                        value: e.target.value,
                      },
                    })
                  }}
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                />
              </Column>
            )}
            {currentItem.fieldSettings?.listType ===
              ListTypesEnum.ZENDESK_CUSTOM_OBJECT && (
              <Column span="5/10">
                <Input
                  label="Zendesk custom object key"
                  name="zendeskCustomObjectKey"
                  type="text"
                  value={
                    currentItem.fieldSettings?.zendeskCustomObjectKey
                      ? String(currentItem.fieldSettings.zendeskCustomObjectKey)
                      : ''
                  }
                  backgroundColor="blue"
                  readOnly={isReadOnly}
                  onChange={(e) => {
                    controlDispatch({
                      type: 'SET_ANY_FIELD_SETTING',
                      payload: {
                        property: 'zendeskCustomObjectKey',
                        value: e.target.value,
                      },
                    })
                  }}
                  onFocus={(e) => setFocus(e.target.value)}
                  onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                />
              </Column>
            )}
          </Row>

          {(currentItem.fieldSettings?.listType ===
            ListTypesEnum.ZENDESK_FIELD_OPTIONS ||
            currentItem.fieldSettings?.listType ===
              ListTypesEnum.ZENDESK_CUSTOM_OBJECT) && (
            <Row>
              <Column span="10/10">
                <Blockquote>
                  <Text variant="small" whiteSpace="preWrap" lineHeight="sm">
                    <code>
                      Zendesk instance:{' '}
                      {form.organizationZendeskInstance?.zendeskInstance}
                      .zendesk.com
                    </code>
                  </Text>
                </Blockquote>
              </Column>
            </Row>
          )}
          {currentItem.fieldSettings?.listType ===
            ListTypesEnum.LIST_FROM_URL && <ListFromUrl />}
        </>
      )}
    </Stack>
  )
}
