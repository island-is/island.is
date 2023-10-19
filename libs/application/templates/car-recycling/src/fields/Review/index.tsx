import { Application, Field, RecordObject } from '@island.is/application/types'
import { FC } from 'react'


interface ReviewScreenProps {
    application: Application
    field: Field & { props?: { editable?: boolean } }
    goToScreen?: (id: string) => void
    refetch?: () => void
    errors?: RecordObject
    editable?: boolean
  }


export const Review: FC<ReviewScreenProps> = ({
    application,
    field,
    goToScreen,
    refetch,
    errors,
  }) => {



    return (<>
    <h1>Senda inn umsókn</h1>
        </>)

  }