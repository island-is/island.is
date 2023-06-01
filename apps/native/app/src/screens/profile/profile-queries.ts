import {useMutation, useQuery} from '@apollo/client';
import {client} from '../../graphql/client';
import {UPDATE_USER_PROFILE} from '../../graphql/queries/update-user-profile.mutation';
import {USER_PROFILE_QUERY} from '../../graphql/queries/user-profile.query';

export const useUpdateUserProfile = () => {
  const [updateUserProfileMutation, {loading, error}] = useMutation(
    UPDATE_USER_PROFILE,
    {
      client,
    },
  );

  const updateUserProfile = (input: {
    email?: string;
    mobilePhoneNumber?: string;
    bankInfo?: string;
    emailCode?: string;
    smsCode?: string;
  }) => {
    return updateUserProfileMutation({
      variables: {
        input,
      },
    }).then(res => {
      if (res.data) {
        try {
          client.query({
            query: USER_PROFILE_QUERY,
            fetchPolicy: 'network-only',
          });
        } catch (err) {
          // do nothing
        }
      }
      return res;
    });
  };

  return {
    updateUserProfile,
    loading,
    error,
  };
};

export const useUserProfile = () =>
  useQuery(USER_PROFILE_QUERY, {
    client,
  });
