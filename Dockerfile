FROM maven:3.2-jdk-8
MAINTAINER Reto Gmür <reto.gmuer@zazuko.com>

EXPOSE 8080

#Prepare
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Build
COPY ./ /usr/src/app

RUN mvn install -DfinalName=OutbreakControl

ENTRYPOINT ["java"]
CMD ["-jar", "target/OutbreakControl.jar"]