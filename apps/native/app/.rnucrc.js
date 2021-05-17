module.exports = {
  on_env: async function (env) {
    console.log('loaded env', env);
    return env;
  },
  js_override: true,
};
