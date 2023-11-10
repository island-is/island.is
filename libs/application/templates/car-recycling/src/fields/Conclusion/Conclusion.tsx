import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  AlertMessage,
  ActionCard,
  AccordionCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { carRecyclingMessages } from '../../lib/messages'
//import RetirementIllustration from '../../assets/Images/Retirement'
import * as styles from './Conclusion.css'
import Markdown from 'markdown-to-jsx'

const Conclusion: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()


  /*
  const handleRefresh = () => {
   navigate(`/${ApplicationConfigurations.OldAgePension.slug}`)
    navigate(
      `/${ApplicationConfigurations.OldAgePension.slug}/${application.id}`,
    )
    navigate(0)
  }*/

  return (
   <h2>Umsókn móttekin</h2>
  )
}

export default Conclusion
