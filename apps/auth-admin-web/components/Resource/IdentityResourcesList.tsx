import React, { useState, useEffect } from 'react';
import IdentityResourcesDTO from '../../entities/dtos/identity-resources.dto';
import { useRouter } from 'next/router';
import ResourceListDisplay from './components/ListDisplay';
import { ResourcesService } from './../../services/ResourcesService';

export default function IdentityResourcesList() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [resources, setResources] = useState<IdentityResourcesDTO[]>([]);
  const [totalCount, setTotalCount] = useState(30);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    getResources(page, count);
  }, [page, count]);

  const edit = (resource: IdentityResourcesDTO) => {
    router.push('/resource/edit/identity-resource/' + resource.name)
  };

  const getResources = async (page: number, count: number) => {
    const response = await ResourcesService.findAndCountAllIdentityResources(page, count);
    if (response){
      setResources(response.rows);
      setTotalCount(response.count);
      setLastPage(Math.ceil(totalCount / count));
    }
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    setPage(page);
    setCount(countPerPage);
  };

  const remove = async (name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this Identity Resource: ${name}?`
      )
    ) {
      const response = await ResourcesService.deleteIdentityResource(name);
      if ( response ){
        getResources(page, count);
      }
    }
  };

  return (
    <ResourceListDisplay
      list={resources}
      header={'Identity resources'}
      linkHeader={'Create new Identity Resource'}
      createUri={'/resource/identity-resource'}
      lastPage={lastPage}
      handlePageChange={handlePageChange}
      edit={edit}
      remove={remove}
    ></ResourceListDisplay>
  );
}
