import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ResourceEditForm from './forms/ResourceEditForm';
import { ResourcesService } from './../../../services/ResourcesService';
import { IdentityResource } from './../../../entities/models/identity-resource.model';

interface Props {
  identityResourceId: string;
}

const IdentityResourceData: React.FC<Props> = ({ identityResourceId }) => {
  const [loaded] = useState<boolean>(false);
  const [resource, setResource] = useState<IdentityResource>(
    new IdentityResource()
  );
  const router = useRouter();

  useEffect(() => {
    getResource();
  }, [loaded]);

  const getResource = async () => {
    const response = await ResourcesService.getIdentityResourceByName(identityResourceId);
    if (response){
      setResource(response);
    }
  };

  const update = async (data: any) => {
    data.resource.name = identityResourceId;
    const response = await ResourcesService.updateIdentityResource(data.resource,identityResourceId);
    if (response){
      router.back();
    }
  };

  return (
    <ResourceEditForm
      data={resource}
      save={update}
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
