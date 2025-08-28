import React from 'react'
import { Navigate } from 'react-router-dom'
import { HealthPaths } from '../../lib/paths'

const PatientData: React.FC = () => {
  return <Navigate to={HealthPaths.HealthPatientDataPermits} replace />
}

export default PatientData
