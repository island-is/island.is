import ContentWrapper from './../../../components/Layout/ContentWrapper';
import React from 'react';
import ApiResourceCreateForm from '../../../components/Resource/forms/ApiResourceCreateForm';
import { ApiResourcesDTO } from './../../../entities/dtos/api-resources-dto';
import { useRouter } from 'next/router';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';

export default function Index() {
  const router = useRouter();
  
  const handleSave = (data: ApiResourcesDTO) => {
    router.push(`/resource/api-resource/${data.name}?step=2`);
  }

  const handleCancel = () => {
    router.back();
  }

  return (
    <ContentWrapper>
      <ResourcesTabsNav />         
      <ApiResourceCreateForm apiResource={new ApiResourcesDTO()} handleSave={handleSave} handleCancel={handleCancel} />
    </ContentWrapper>
  );
}
