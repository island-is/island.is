ARG DOCKER_IMAGE_REGISTRY=docker.elastic.co
FROM $DOCKER_IMAGE_REGISTRY/elasticsearch/elasticsearch:7.9.2

# adding ICO for unicode support
RUN bin/elasticsearch-plugin install analysis-icu

RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-* && \
  sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

# hadolint ignore=DL3033
RUN yum -y install unzip wget && \
  yum clean all

# get dictionaries
RUN wget --progress=dot -O master.zip https://github.com/island-is/elasticsearch-dictionaries/archive/master.zip && \
  mv master.zip /usr/share/elasticsearch/config/ && \
  # unzip git repo
  unzip /usr/share/elasticsearch/config/master.zip -d /usr/share/elasticsearch/config && \
  # move analyzers to correct folder
  mv /usr/share/elasticsearch/config/elasticsearch-dictionaries-master/is /usr/share/elasticsearch/config/analyzers

# cleanup
RUN rm /usr/share/elasticsearch/config/master.zip && \
  rm -rf /usr/share/elasticsearch/config/elasticsearch-dictionaries-master
