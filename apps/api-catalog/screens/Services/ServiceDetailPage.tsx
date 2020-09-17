import React from 'react'
import { ServiceCardInformation, 
        getService, 
        ServiceResult, ServiceDetail} from '../../components';

export interface ServiceDetailPageProps {
    service:ServiceCardInformation
}

export function ServiceDetailPage(props:ServiceDetailPageProps) {

    return (
        <ServiceDetail service={props.service} />
    )
}

ServiceDetailPage.getInitialProps = async (ctx):Promise<ServiceDetailPageProps> => {
    const { query } = ctx;
    const service:ServiceResult = await getService(query.service);

  return { service:service.result };
  }