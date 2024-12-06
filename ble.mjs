const requested_reviewers = [
  {
    avatar_url: 'https://avatars.githubusercontent.com/u/1974615?v=4',
    events_url: 'https://api.github.com/users/brynjarorng/events{/privacy}',
    followers_url: 'https://api.github.com/users/brynjarorng/followers',
    following_url: 'https://api.github.com/users/brynjarorng/following{/other_user}',
    gists_url: 'https://api.github.com/users/brynjarorng/gists{/gist_id}',
    gravatar_id: '',
    html_url: 'https://github.com/brynjarorng',
    id: 1974615,
    login: 'brynjarorng',
    node_id: 'MDQ6VXNlcjE5NzQ2MTU=',
    organizations_url: 'https://api.github.com/users/brynjarorng/orgs',
    received_events_url: 'https://api.github.com/users/brynjarorng/received_events',
    repos_url: 'https://api.github.com/users/brynjarorng/repos',
    site_admin: false,
    starred_url: 'https://api.github.com/users/brynjarorng/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/brynjarorng/subscriptions',
    type: 'User',
    url: 'https://api.github.com/users/brynjarorng',
    user_view_type: 'public'
  },
  {
    avatar_url: 'https://avatars.githubusercontent.com/u/1974615?v=4',
    events_url: 'https://api.github.com/users/brynjarorng/events{/privacy}',
    followers_url: 'https://api.github.com/users/brynjarorng/followers',
    following_url: 'https://api.github.com/users/brynjarorng/following{/other_user}',
    gists_url: 'https://api.github.com/users/brynjarorng/gists{/gist_id}',
    gravatar_id: '',
    html_url: 'https://github.com/brynjarorng',
    id: 1974615,
    login: 'brynjarorng',
    node_id: 'MDQ6VXNlcjE5NzQ2MTU=',
    organizations_url: 'https://api.github.com/users/brynjarorng/orgs',
    received_events_url: 'https://api.github.com/users/brynjarorng/received_events',
    repos_url: 'https://api.github.com/users/brynjarorng/repos',
    site_admin: false,
    starred_url: 'https://api.github.com/users/brynjarorng/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/brynjarorng/subscriptions',
    type: 'User',
    url: 'https://api.github.com/users/brynjarorng',
    user_view_type: 'public'
  }
]


var requested_reviewersNames = requested_reviewers.map((reviewer) => reviewer.login);
console.log(requested_reviewersNames);

