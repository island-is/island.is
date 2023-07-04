import {gql} from '@apollo/client';

export const OrganizationFragment = gql`
  fragment OrganizationFragment on Organization {
    id
    title
    shortTitle
    description
    slug
    tag {
      id
      title
    }
    logo {
      id
      url
      title
      contentType
      width
      height
    }
    link
  }
`;

interface IImage {
  id: string;
  url: string;
  title: string;
  contentType: string;
  width: number;
  height: number;
}

export interface IOrganization {
  id: string;
  title: string;
  shortTitle: string;
  description?: string;
  slug: string;
  tag: Array<{id: string; title: string}>;
  logo?: IImage;
  link?: string;
}
