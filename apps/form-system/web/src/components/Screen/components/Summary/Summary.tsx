import React from 'react'
import { FormSystemField } from '@island.is/api/schema'

interface Props {
  field?: FormSystemField
}


export const Summary = ({ field }: Props) => {
    console.log("fields", field)
    return (
        <div>
            <h2>Summary</h2>
        </div>
    )
}