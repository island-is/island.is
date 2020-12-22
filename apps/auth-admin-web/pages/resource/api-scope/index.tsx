import ContentWrapper from './../../../components/Layout/ContentWrapper';
import React from 'react';
import ApiScopeCreateForm from './../../../components/Resource/components/forms/ApiScopeCreateForm';
import { ApiScopesDTO } from './../../../entities/dtos/api-scopes-dto';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  const handleSave = (data: ApiScopesDTO) => {
    router.push(`edit/api-scope/${data.name}`);
  }

  const handleCancel = () => {
    router.back();
  }

  return (
    <ContentWrapper>
      <ApiScopeCreateForm handleSave={handleSave} handleCancel={handleCancel} apiScope={new ApiScopesDTO()} />
    </ContentWrapper>
  );
}
