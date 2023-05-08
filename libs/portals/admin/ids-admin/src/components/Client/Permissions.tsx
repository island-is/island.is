import ContentCard from '../../shared/components/ContentCard'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Box, Button, Table as T, Text, Icon } from '@island.is/island-ui/core'
import React, { useState } from 'react'
import AddPermissions from '../forms/AddPermissions/AddPermissions'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import { ShadowBox } from '../ShadowBox/ShadowBox'

type Permission = {
  id: string
  label: string
  description: string
  api: string
  locked?: boolean
}

interface PermissionsProps {
  data?: Permission[]
}

const mockData: NonNullable<PermissionsProps['data']> = [
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
    id: '@island.is/finance',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Full Access',
    id: '@island.is/auth/admin',
    description:
      'Full access to authorization admin something description here',
    api: 'Island.is APIs',
    locked: false,
  },
]

function Permissions({ data = mockData }: PermissionsProps) {
  const { formatMessage } = useLocale()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  const handleModalOpen = () => {
    setIsModalVisible(true)
  }

  const hasData = Array.isArray(data) && data.length > 0

  return (
    <ContentCard
      title={formatMessage(m.permissions)}
      description={formatMessage(m.permissionsDescription)}
      intent={ClientFormTypes.permissions}
    >
      <Box marginBottom={5}>
        <Button onClick={handleModalOpen}>
          {formatMessage(m.permissionsAdd)}
        </Button>
      </Box>
      {hasData && (
        <ShadowBox style={{ maxHeight: 440 }}>
          <T.Table box={{ overflow: 'initial' }}>
            <T.Head sticky>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelDescription)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelAPI)}
                </T.HeadData>
                <T.HeadData>{/* For matching column count */}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {data.map((item) => (
                <T.Row key={item.id}>
                  <T.Data>
                    <Box display="flex" columnGap={1} alignItems="center">
                      {item.locked && (
                        <Icon
                          type="outline"
                          icon="lockClosed"
                          size="small"
                          color="blue400"
                        />
                      )}
                      <Text variant="eyebrow">{item.label}</Text>
                    </Box>
                    {item.id}
                  </T.Data>
                  <T.Data>{item.description}</T.Data>
                  <T.Data>{item.api}</T.Data>
                  <T.Data>
                    <Button
                      aria-label={formatMessage(m.permissionsButtonLabelRemove)}
                      icon="trash"
                      variant="ghost"
                      iconType="outline"
                      size="small"
                    />
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </ShadowBox>
      )}
      <AddPermissions onClose={handleModalClose} isVisible={isModalVisible} />
    </ContentCard>
  )
}

export default Permissions
