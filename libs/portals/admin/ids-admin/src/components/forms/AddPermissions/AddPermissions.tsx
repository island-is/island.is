import { Modal } from '@island.is/react/components'
import {
  Box,
  Button,
  Checkbox,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { Form } from 'react-router-dom'
import { ShadowBox } from '../../ShadowBox/ShadowBox'

interface AddPermissionsProps {
  isVisible: boolean

  onClose(): void
}

type Permission = {
  id: string
  label: string
  description: string
  api: string
  locked?: boolean
}

const mockData: Permission[] = [
  {
    label: 'Staða og hreyfingar',
    id: '@island.is/finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Full Access',
    id: '@island.is/auth/admin:full',
    description:
      'Full access to authorization admin something description here',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Skattskýrslur',
    id: '@skatturinn.is/skattskyrslur',
    description:
      'Full access to authorization admin something description here',
    api: 'Skatturinn',
    locked: true,
  },
  {
    label: 'Staða og hreyfingar',
    id: '@island.is/finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Full Access',
    id: '@island.is/auth/admin:full',
    description:
      'Full access to authorization admin something description here',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Skattskýrslur',
    id: '@skatturinn.is/skattskyrslur',
    description:
      'Full access to authorization admin something description here',
    api: 'Skatturinn',
    locked: true,
  },
]

function AddPermissions({ isVisible, onClose }: AddPermissionsProps) {
  const { formatMessage } = useLocale()

  return (
    <Form method="post">
      <Modal
        label={formatMessage(m.permissionsModalTitle)}
        title={formatMessage(m.permissionsModalTitle)}
        id="add-permissions"
        isVisible={isVisible}
        onClose={onClose}
        closeButtonLabel={formatMessage(m.closeModal)}
        scrollType="outside"
      >
        <Box marginTop={1} marginBottom={4}>
          <Text>{formatMessage(m.permissionsModalDescription)}</Text>
        </Box>
        <ShadowBox isDisabled={!isVisible} flexShrink={1} overflow="auto">
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{/* For matching column count */}</T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelDescription)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelAPI)}
                </T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {mockData.map((item) => (
                <T.Row key={item.id}>
                  <T.Data>
                    <Checkbox value={item.id} />
                  </T.Data>
                  <T.Data>
                    <Text variant="eyebrow">{item.label}</Text>
                    {item.id}
                  </T.Data>
                  <T.Data>{item.description}</T.Data>
                  <T.Data>{item.api}</T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </ShadowBox>
        <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
          <Button onClick={onClose} variant="ghost">
            {formatMessage(m.cancel)}
          </Button>
          <Button type="submit">{formatMessage(m.add)}</Button>
        </Box>
      </Modal>
    </Form>
  )
}

export default AddPermissions
