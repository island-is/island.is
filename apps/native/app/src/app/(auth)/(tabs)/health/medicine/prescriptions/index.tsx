import React from 'react'

import { PrescriptionsTab } from '@/components/health-tabs/prescriptions-tab'

type Tab = {
  id: string
  title: string
  component: React.ComponentType<{ initial: boolean }>
}

export default function PrescriptionsScreen() {
  return <PrescriptionsTab />
}
