#!/bin/sh
set -eu

csp_export="$(
  node /docker-entrypoint.d/merge-csp-hashes.js /usr/share/nginx/html
)"
eval "$csp_export"
export CONTENT_SECURITY_POLICY CONTENT_SECURITY_POLICY_REPORT_ONLY
unset csp_export

# nginx's entrypoint executes .sh hooks in child processes, so exported values
# do not reach the later 20-envsubst-on-templates.sh hook. Substitute only CSP
# here and leave BASEPATH (and any other template variables) for that hook.
csp_template="${CSP_NGINX_TEMPLATE:-/etc/nginx/templates/default.conf.template}"
test -f "$csp_template"
csp_template_tmp="${csp_template}.csp.$$"
trap 'rm -f "$csp_template_tmp"' EXIT
envsubst "\${CONTENT_SECURITY_POLICY} \${CONTENT_SECURITY_POLICY_REPORT_ONLY}" < "$csp_template" > "$csp_template_tmp"
mv "$csp_template_tmp" "$csp_template"
trap - EXIT
