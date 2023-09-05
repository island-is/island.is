import {getConfig} from '../config';
import {ApplicationConfigurations} from '@island.is/application/types/lib/ApplicationTypes';
import {IApplication} from '../graphql/fragments/application.fragment';

export const getSlugFromType = (type: string) => {
  for (const [key, value] of Object.entries(ApplicationConfigurations)) {
    if (type === key) {
      return value.slug;
    }
  }

  return undefined;
};

export const getApplicationUrl = (application: IApplication) => {
  const slug = getSlugFromType(application.typeId);
  const uri = `${getConfig().apiUrl.replace(/api$/, 'umsoknir')}/${slug}/${
    application.id
  }`;
  return uri;
};

export const getApplicationOverviewUrl = (application: IApplication) => {
  const uri = `${getConfig().apiUrl.replace(/api$/, 'umsoknir')}/${
    application.id
  }`;
  return uri;
}
