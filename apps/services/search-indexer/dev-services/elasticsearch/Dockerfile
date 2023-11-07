ARG DOCKER_IMAGE_REGISTRY=docker.elastic.co
FROM $DOCKER_IMAGE_REGISTRY/elasticsearch/elasticsearch:7.9.2

# adding ICO for unicode support
RUN bin/elasticsearch-plugin install analysis-icu

RUN yum -y install unzip wget

# get dictionaries
RUN wget -O master.zip https://github.com/island-is/elasticsearch-dictionaries/archive/master.zip

RUN mv master.zip /usr/share/elasticsearch/config/

# unzip git repo
RUN unzip /usr/share/elasticsearch/config/master.zip -d /usr/share/elasticsearch/config

# move analyzers to correct folder
RUN mv /usr/share/elasticsearch/config/elasticsearch-dictionaries-master/is /usr/share/elasticsearch/config/analyzers

# cleanup
RUN rm /usr/share/elasticsearch/config/master.zip
RUN rm -rf /usr/share/elasticsearch/config/elasticsearch-dictionaries-master
