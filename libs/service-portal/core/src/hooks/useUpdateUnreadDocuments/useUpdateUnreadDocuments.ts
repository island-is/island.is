import { useContext } from 'react'
import { BadgeContext } from '../../contexts/BadgeContext'

export function useUpdateUnreadDocuments() {
  return useContext(BadgeContext)
}
