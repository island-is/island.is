import React, { FC } from 'react'
import { ActionCard, ActionMenuItem } from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'

interface Props {
  document: Document
}

const DocumentCard: FC<Props> = ({ document }) => {
  // TODO: This call is really heavy on the API
  // const { data } = useDocumentDetail(document.id)

  return (
    <ActionCard
      title={document.subject}
      date={new Date(document.date)}
      label={document.senderName}
      url={'//island.is'}
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
