import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  DialogPrompt,
  toast,
  AlertMessage,
  DatePicker,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'

import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useMutation } from '@apollo/client'
import Skeleton from '../../components/Skeleton/skeleton'
// import {
//   useGetSinglePetition,
//   useGetSinglePetitionEndorsements,
// } from '../hooks'

const SingleList = () => {
  return (
    <Box>
      <Skeleton />
    </Box>
  )
}

export default SingleList
