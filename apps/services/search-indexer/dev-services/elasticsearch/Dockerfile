FROM elasticsearch:7.4.2

# adding ICO for unicode support
RUN bin/elasticsearch-plugin install analysis-icu

# get dictionaries
ADD https://github.com/island-is/elasticsearch-dictionaries/archive/master.zip /usr/share/elasticsearch/config/

# unzip git repo
RUN yum -y install unzip
RUN unzip /usr/share/elasticsearch/config/master.zip -d /usr/share/elasticsearch/config

# move analyzers to correct folder
RUN mv /usr/share/elasticsearch/config/elasticsearch-dictionaries-master/is /usr/share/elasticsearch/config/analyzers

# cleanup
RUN rm /usr/share/elasticsearch/config/master.zip
RUN rm -rf /usr/share/elasticsearch/config/elasticsearch-dictionaries-master