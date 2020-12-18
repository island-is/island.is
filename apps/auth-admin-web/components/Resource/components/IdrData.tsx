import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdentityResourcesDTO from 'apps/auth-admin-web/models/dtos/identity-resources.dto';
import { useRouter } from 'next/router';
import ResourceEditForm from './forms/ResourceEditForm';

interface Props {
  identityResourceId: string;
}

const IdentityResourceData: React.FC<Props> = ({ identityResourceId }) => {
  const [loaded] = useState<boolean>(false);
  const [resource, setResource] = useState<IdentityResourcesDTO>(
    new IdentityResourcesDTO()
  );
  const router = useRouter();

  useEffect(() => {
    getResource();
  }, [loaded]);

  const getResource = async () => {
    await axios
      .get(`/api/identity-resource/` + identityResourceId)
      .then((response) => {
        setResource(response.data);
      });
  };

  const save = async (data: any) => {
    data.resource.name = identityResourceId;
    await axios
      .put(`/api/identity-resource/` + identityResourceId, data.resource)
      .then(() => {
        router.back();
      });
  };

  return (
    <ResourceEditForm
      data={resource}
      save={save}
      hideBooleanValues={false}
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
          'Specifies whether the consent screen will emphasize this resource (if the consent screen wants to implement such a feature). Use this setting for sensitive or important resources.',
      }}
    />
  );
};

export default IdentityResourceData;
