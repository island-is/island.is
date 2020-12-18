import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ApiScopesDTO } from './../../../entities/dtos/api-scopes-dto';
import ResourceEditForm from './forms/ResourceEditForm';
import { useRouter } from 'next/router';

interface Props {
  apiScopeId: string;
}

const ApiScopeData: React.FC<Props> = ({ apiScopeId }) => {
  const [loaded] = useState<boolean>(false);
  const [apiScope, setApiScope] = useState<ApiScopesDTO>(new ApiScopesDTO());
  const router = useRouter();

  useEffect(() => {
    getResource();
  }, [loaded]);

  const getResource = async () => {
    await axios.get(`/api/api-scope/` + apiScopeId).then((response) => {
      setApiScope(response.data);
    });
  };

  const save = async (data: any) => {
    data.resource.name = apiScopeId;

    await axios.put(`/api/api-scope/` + apiScopeId, data.resource).then(() => {
      router.back();
    });
  };

  return (
    <ResourceEditForm
      data={apiScope}
      save={save}
      hideBooleanValues={false}
      texts={{
        enabled: 'Specifies if the scope is enabled',
        name: "The scope' s unique name can't be changed",
        displayName: 'The name that will be used to display the scope',
        description: 'It is optional to write some text to describe this scope',
        showInDiscoveryDocument:
          'Specifies whether this scope is shown in the discovery document.',
        required:
          'Specifies whether the user can de-select the scope on the consent screen (if the consent screen wants to implement such a feature)',
        emphasize:
          'Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes.',
      }}
    />
  );
};

export default ApiScopeData;
