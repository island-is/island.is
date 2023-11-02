import {gql} from '@apollo/client';
import {INotification} from '../fragments/notification.fragment';

export const LIST_NOTIFICATIONS_QUERY = gql`
  query listNotifications {
    listNotifications {
      id
      serviceProvider
      date
      title
      message
      actions {
        id
        text
        link
      }
      link
    }
  }
`;

export interface ListNotificationsResponse {
  listNotifications: INotification[];
}
