import React from 'react'
import BlueBox from '../BlueBox/BlueBox'

interface Props {
  name: string
  size: number
  uploadedAt: Date
  link: string
}

const File: React.FC<Props> = (props) => {
  return <BlueBox>Herro</BlueBox>
}

export default File
