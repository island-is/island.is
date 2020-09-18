import React from 'react'
import { useQuery } from 'react-apollo';
import { ServiceCardInformation, 
        getService, 
        ServiceResult, ServiceDetail, Layout} from '../../components';
import { GET_CATALOGUES_QUERY } from '../Queries';


import {
    Query,
    QueryGetApiCatalogueByIdArgs
  } from '@island.is/api/schema'

function ServiceDetailPage(service: ServiceCardInformation) {
/*
    const { data, loading } = useQuery<Query, QueryGetApiCatalogueByIdArgs>(
        GET_CATALOGUES_QUERY,
        {
          variables: { input: { id: service.id.toString() } },
        },
      )
      console.log(data)
      if (loading) return null
      console.log(data.getApiCatalogueById.serviceName)
      //service.name = String(data.getApiCatalogueById.serviceName);

*/
    return (
        <Layout
            left ={
                        <ServiceDetail service={service} />}
        />
    )
}

ServiceDetailPage.getInitialProps = async (ctx):Promise<ServiceCardInformation> => {
    const { query } = ctx;
    const service:ServiceResult = await getService(query.service);
    //service.result.id = Number(query.service);

  return service.result;
}

export default ServiceDetailPage;