import React from 'react'
import BlueBox from '../BlueBox/BlueBox'

interface Props {
  name: string
  size: number
  uploadedAt: Date
  link: string
}

const CaseFile: React.FC<Props> = (props) => {
  const { name } = props
  return <BlueBox>{name}</BlueBox>
}

export default CaseFile
