import ContentWrapper from './../../../components/Layout/ContentWrapper';
import React from 'react';
import ApiScopeCreateForm from '../../../components/Resource/forms/ApiScopeCreateForm';
import { ApiScopesDTO } from './../../../entities/dtos/api-scopes-dto';
import { useRouter } from 'next/router';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';

export default function Index() {
  const router = useRouter();

  const handleSave = (data: ApiScopesDTO) => {
    router.push(`/resource/api-scope/${encodeURIComponent(data.name)}?step=2`);
  }

  const handleCancel = () => {
    router.back();
  }

  return (
    <ContentWrapper>
      <ResourcesTabsNav />         
      <ApiScopeCreateForm handleSave={handleSave} handleCancel={handleCancel} apiScope={new ApiScopesDTO()} />
    </ContentWrapper>
  );
}
