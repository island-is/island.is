{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "api-template.name" -}}
{{- if .Values.name -}}
    {{- .Values.name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
    {{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "api-template.fullname" -}}
{{- if .Values.fullnameOverride -}}
    {{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
    {{- $name := .Values.name | default .Chart.Name .Values.nameOverride -}}
    {{- if contains $name .Release.Name -}}
        {{- .Release.Name | trunc 63 | trimSuffix "-" -}}
    {{- else -}}
        {{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
    {{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "api-template.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "api-template.labels" -}}
helm.sh/chart: {{ include "api-template.chart" . }}
{{ include "api-template.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "api-template.selectorLabels" -}}
app.kubernetes.io/name: {{ include "api-template.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "api-template.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "api-template.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Resolve the image tag.
Prioritizes .Values.image.tag, falling back to .Values.global.image.tag if available.
Fails if both are missing.
*/}}
{{- define "api-template.version" -}}
{{- $tag := .Values.image.tag | default "" -}}
{{- if eq $tag "" }}
    {{- if and (hasKey .Values "global") (hasKey .Values.global "image") (hasKey .Values.global.image "tag") -}}
        {{- $tag = .Values.global.image.tag -}}
    {{- end -}}
{{- end }}
{{- if eq $tag "" }}
    {{- fail "Either image.tag or global.image.tag must be set" }}
{{- end }}
{{- $tag -}}
{{- end }}

{{/*
Resolve the full image reference (repository:tag).
Prioritizes .Values.image.repository and uses the tag resolved by api-template.version.
Fails if image.repository is missing.
*/}}
{{- define "api-template.image" -}}
{{- $repository := .Values.image.repository | default "" -}}
{{- if eq $repository "" }}
    {{- fail "image.repository is required and must be set" }}
{{- end }}

{{- $tag := include "api-template.version" . -}}

{{- printf "%s:%s" $repository $tag -}}
{{- end }}
