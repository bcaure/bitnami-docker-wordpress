# Deploy WordPress in Azure Containers

## Wordpress Bitnami image
Doc: https://github.com/bitnami/bitnami-docker-apache

## Getting started

### Test locally with local docker

1. Go to 5/debian-10
2. Build the Wordpress image `docker build -t bitnami-wordpress .`
3. Return to root directory and run the _docker-compose-local.yml_ file: `docker-compose -f docker-compose-local.yml up`
4. Login as administrator in `http://localhost/wp-admin` using
  - WORDPRESS_USERNAME=user
  - WORDPRESS_PASSWORD=wp-bitnami-aci

### Deploy to Azure ACI

Pre-requisites: Create Azure Container Registry (ACR), create Azure storage account with file shares called _wordpress-db_ and _wordpress-files_

#### Push the image to Azure ACR
1. Go to 5/debian-10
2. Build the Wordpress image `docker build -t bitnami-wordpress .`
3. Tag the image to your registry `docker tag bitnami-wordpress benjamincaure.azurecr.io/bitnami-wordpress`
4. Login to the your registry `az acr login --name benjamincaure.azurecr.io`
4. Push the image to your registry `docker push benjamincaure.azurecr.io/bitnami-wordpress`

#### Customize the docker-compose file
1. Edit _docker-compose.yml_: 
2. Change the _wordpress_ service image: `image: benjamincaure.azurecr.io/bitnami-wordpress:latest`
3. Change the _wordress_ service domain name: `domainname: <aNonExistingDomain>`
4. Change the _volumes_ config to match your Azure storage: `storage_account_name: wordpress` `share_name: wordpress-files` `share_name: wordpress-db`

#### Run docker compose in Azure ACI context
1. Return to root directory and create the ACI context `docker context create aci benjamincaureuca` or use the existing one `docker context use benjamincaureuca`
2. Login to Azure with Docker `docker login azure`
4. Use docker compose (not docker-compose!!) to start containers in Azure: `docker compose up --build -d`
5. Run `docker ps` to see the IP address or the domain name to access from the browser (normally you can access using the domain `<aNonExistingDomain>.<region>.azurecontainer.io`)
6. In case of error, run `docker logs bitnami-docker-wordpress_wordpress` to see Azure logs
7. If everything's fine, log-in as administrator with the user/password defined in _docker-compose.yml_ :
  - WORDPRESS_USERNAME=user
  - WORDPRESS_PASSWORD=wp-bitnami-aci

## Update the Dockerfile
1. After updating the Dockerfile, run `docker context use default` and perform the "Push the image to Azure ACR" steps.
2. Stop and remove containers
```
docker compose down
```
3. **Remove volumes**!! unless the new image might not take changes into account.
```
docker volume rm wordpressdb/wordpress-files
docker volume rm wordpressdb/wordpress-db
```
4. Perform the "Run docker compose in Azure ACI context" steps

## Why use Bitnami Images?

- Bitnami closely tracks upstream source changes and promptly publishes new versions of this image using our automated systems.
- With Bitnami images the latest bug fixes and features are available as soon as possible.
- Bitnami containers, virtual machines and cloud images use the same components and configuration approach - making it easy to switch between formats based on your project needs.
- All our images are based on [minideb](https://github.com/bitnami/minideb) a minimalist Debian based container image which gives you a small base container image and the familiarity of a leading Linux distribution.
- All Bitnami images available in Docker Hub are signed with [Docker Content Trust (DCT)](https://docs.docker.com/engine/security/trust/content_trust/). You can use `DOCKER_CONTENT_TRUST=1` to verify the integrity of the images.
- Bitnami container images are released daily with the latest distribution packages available.

> This [CVE scan report](https://quay.io/repository/bitnami/wordpress?tab=tags) contains a security report with all open CVEs. To get the list of actionable security issues, find the "latest" tag, click the vulnerability report link under the corresponding "Security scan" field and then select the "Only show fixable" filter on the next page.
