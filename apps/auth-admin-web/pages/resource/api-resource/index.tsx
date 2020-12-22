import ContentWrapper from './../../../components/Layout/ContentWrapper';
import React from 'react';
import ApiResourceCreateForm from './../../../components/Resource/components/forms/ApiResourceCreateForm';
import { ApiResourcesDTO } from './../../../entities/dtos/api-resources-dto';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  
  const handleSave = (data: ApiResourcesDTO) => {
    router.push(`edit/api-resource/${data.name}`);
  }

  const handleCancel = () => {
    router.back();
  }

  return (
    <ContentWrapper>
      <ApiResourceCreateForm apiResource={new ApiResourcesDTO()} handleSave={handleSave} handleCancel={handleCancel} />
    </ContentWrapper>
  );
}
