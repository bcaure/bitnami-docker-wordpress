# Deploy WordPress in Azure Containers

## Getting started

### Test locally with local docker

1. Go to 5/debian-10
2. Build the Wordpress image `docker build -t bitnami-wordpress . `
3. Return to root directory and run the _docker-compose-local.yml_ file: `docker-compose up -f docker-compose-local.yml`

### Deploy to Azure ACI

Pre-requisites: Create Azure Container Registry (ACR), create Azure storage account with file shares called _wordpress-db_ and _wordpress-files_

1. Go to 5/debian-10
2. Build the Wordpress image `docker build -t bitnami-wordpress . `
3. Tag the image to your registry `docker tag bitnami-wordpress benjamincaure.azurecr.io/bitnami-wordpress:latest`
4. Login to the your registry `az acr login --name benjamincaure.azurecr.io`
4. Push the image to your registry `docker push benjamincaure.azurecr.io/bitnami-wordpress:latest`
5. Return to root directory and create the ACI context `docker context create aci benjamincaureuca` or use the existing one `docker context use benjamincaureuca`
6. Login to Azure with Docker `docker login azure`
7. In _docker-compose.yml_: 
  - Change the _wordpress_ service image: `image: benjamincaure.azurecr.io/bitnami-wordpress:latest`
  - Change the _volumes_ config to match your Azure storage: `storage_account_name: wordpress` `share_name: wordpress-files` `share_name: wordpress-db`
9. Use docker compose (not docker-compose!!) to start containers in Azure: `docker compose up --build -d`
10. Run `docker ps`to see the IP address where Wordpress is running, access this IP address from the browser
11. Log-in as administrator with the user/password defined in _docker-compose.yml_ :
  - WORDPRESS_USERNAME=user
  - WORDPRESS_PASSWORD=wp-bitnami-aci

## Why use Bitnami Images?

- Bitnami closely tracks upstream source changes and promptly publishes new versions of this image using our automated systems.
- With Bitnami images the latest bug fixes and features are available as soon as possible.
- Bitnami containers, virtual machines and cloud images use the same components and configuration approach - making it easy to switch between formats based on your project needs.
- All our images are based on [minideb](https://github.com/bitnami/minideb) a minimalist Debian based container image which gives you a small base container image and the familiarity of a leading Linux distribution.
- All Bitnami images available in Docker Hub are signed with [Docker Content Trust (DCT)](https://docs.docker.com/engine/security/trust/content_trust/). You can use `DOCKER_CONTENT_TRUST=1` to verify the integrity of the images.
- Bitnami container images are released daily with the latest distribution packages available.

> This [CVE scan report](https://quay.io/repository/bitnami/wordpress?tab=tags) contains a security report with all open CVEs. To get the list of actionable security issues, find the "latest" tag, click the vulnerability report link under the corresponding "Security scan" field and then select the "Only show fixable" filter on the next page.
