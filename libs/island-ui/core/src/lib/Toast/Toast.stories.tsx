import React from 'react'
import Toast, { toast } from './Toast'
import { Button } from '../Button/Button'

export default {
  title: 'Alerts/Toast',
  component: Toast,
}

export const Default = () => (
  <div>
    <Button onClick={() => toast.success('Success')} />
    <Toast

    />
  </div>
)
