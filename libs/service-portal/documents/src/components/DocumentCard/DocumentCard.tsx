import React, { FC } from 'react'
import { ActionCard, ActionMenuItem } from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'
import { useDocumentDetail } from '@island.is/service-portal/graphql'

interface Props {
  document: Document
}

const DocumentCard: FC<Props> = ({ document }) => {
  const { data } = useDocumentDetail(document.id)

  return (
    <ActionCard
      title={document.subject}
      date={new Date(document.date)}
      label={document.senderName}
      url={data?.url}
      external
      key={document.id}
      actionMenuRender={() => (
        <>
          <ActionMenuItem>Fela skjal</ActionMenuItem>
          <ActionMenuItem>Eyða skjali</ActionMenuItem>
        </>
      )}
    />
  )
}

export default DocumentCard
