import { ApplicationService } from '../../services/application.service'
import { DirectorateOfLabourService } from '../../services/directorate-of-labour.service'
import { IcelandicRevenueService } from '../../services/icelandic-revenue-service'
import React, { createContext, useEffect, useMemo, useState } from 'react'

interface IServicesContext {
  applicationService?: ApplicationService
  icelandicRevenueService?: IcelandicRevenueService
  directorateOfLabourService?: DirectorateOfLabourService
}

export const ServiceContext = createContext<IServicesContext>({})

interface Props {}

const ServicesProvider: React.FC<Props> = ({ children }) => {
  const applicationService = useMemo(() => new ApplicationService(), [])
  const icelandicRevenueService = useMemo(
    () => new IcelandicRevenueService(),
    [],
  )
  const directorateOfLabourService = useMemo(
    () => new DirectorateOfLabourService(),
    [],
  )

  return (
    <ServiceContext.Provider
      value={{
        applicationService,
        icelandicRevenueService,
        directorateOfLabourService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export default ServicesProvider
