import React from 'react';
import ContentWrapper from './../../../components/Layout/ContentWrapper';
import IdentityResourceCreateForm from '../../../components/Resource/forms/IdentityResourceCreateForm';
import IdentityResourcesDTO from './../../../entities/dtos/identity-resources.dto';
import { useRouter } from 'next/router';
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav';
import { GetServerSideProps } from 'next';
import { withAuthentication } from './../../../utils/auth.utils';

const Index: React.FC = () => {
  const router = useRouter();
  const handleSave = (data: IdentityResourcesDTO) => {
    router.push(
      `/resource/identity-resource/${encodeURIComponent(data.name)}?step=2`
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <IdentityResourceCreateForm
        identityResource={new IdentityResourcesDTO()}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </ContentWrapper>
  );
}
export default Index;

export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context: any) => {
    return {
      props: {},
    };
  }
);
