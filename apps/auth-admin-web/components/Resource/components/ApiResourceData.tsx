import React, { useEffect, useState } from 'react';
import ResourceEditForm from '../forms/ResourceEditForm';
import { useRouter } from 'next/router';
import { ResourcesService } from './../../../services/ResourcesService';
import { ApiResource } from './../../../entities/models/api-resource.model';


interface Props {
  apiResourceId: string;
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ApiResourceData: React.FC<Props> = ({ apiResourceId, handleNext, handleBack }) => {
  const [loaded] = useState<boolean>(false);
  const [apiResource, setApiResource] = useState<ApiResource>(
    new ApiResource()
  );
  const router = useRouter();

  useEffect(() => {
    getResource();
  }, [loaded]);

  const getResource = async () => {
    const response = await ResourcesService.getApiResourceByName(apiResourceId);
    if ( response ){
      setApiResource(response);
    }
  };

  const update = async (data: any) => {
    data.resource.name = apiResourceId;
    // TODO: USB -> Þarf að taka deep copy af þessu áður en þú eyðir Stulli?
    delete data.resource.emphasize;
    delete data.resource.required;

    const response = await ResourcesService.updateApiResource(data, apiResourceId);
    if ( response)
    {
      if (handleNext){
        handleNext();
      }
    }
  };

  return (
    <ResourceEditForm
      data={apiResource}
      save={update}
      hideBooleanValues={true}
      texts={{
        enabled: 'Specifies if the resource is enabled',
        name: "The resource's unique name can't be changed",
        displayName: 'The name that will be used to display the resource',
        description:
          'It is optional to write some text to describe this resource',
        showInDiscoveryDocument:
          'Specifies whether this resource is shown in the discovery document.',
        required:
          'Specifies whether the user can de-select the resource on the consent screen (if the consent screen wants to implement such a feature)',
        emphasize:
          'Specifies whether the consent screen will emphasize this resource (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes.',
      }}
    />
  );
};

export default ApiResourceData;
