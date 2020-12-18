import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceEditForm from './forms/ResourceEditForm';
import { ApiResourcesDTO } from './../../../entities/dtos/api-resources-dto';
import { useRouter } from 'next/router';

interface Props {
  apiResourceId: string;
}

const ApiResourceData: React.FC<Props> = ({ apiResourceId }) => {
  const [loaded] = useState<boolean>(false);
  const [apiResource, setApiResource] = useState<ApiResourcesDTO>(
    new ApiResourcesDTO()
  );
  const router = useRouter();

  useEffect(() => {
    getResource();
  }, [loaded]);

  const getResource = async () => {
    await axios.get(`/api/api-resource/` + apiResourceId).then((response) => {
      setApiResource(response.data);
    });
  };

  const save = async (data: any) => {
    data.resource.name = apiResourceId;
    delete data.resource.emphasize;
    delete data.resource.required;

    await axios
      .put(`/api/api-resource/` + apiResourceId, data.resource)
      .then(() => {
        // router.back();
      });
  };

  return (
    <ResourceEditForm
      data={apiResource}
      save={save}
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
