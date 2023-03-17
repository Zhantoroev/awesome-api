# Awesome-Cats Backend
## Instructions to build to Docker image 
1. Clone repo
```
git clone https://github.com/beknazar001/backend-awesome-cats.git
cd backend-awesome-cats
```
2. Build a docker image with the tag name 'backend'
```
docker build -t backend .
```
3. Create a new repo in Docker Hub and Login to docker from CLI
```
docker login
```
4. Change docker image tag
```bash
docker tag frontend <docker-username>/<repo-name>
# If you'd like to add tag you can run
docker tag frontend <docker-username>/<repo-name>:tagname
```
4. Push your image to Docker Hub
```
docker push <docker-username>/<repo-name>:
```

After completing all of those steps above you would have a built docker image that you can use further as the usual docker image<br><br>

```bash
#NOTE: If you'd like to run this backend application as a docker container, then you need to specify environment variables  such as *_PGHOST, PGUSER, PGDATABASE, PGPASSWORD_* to connect to the PostgreSQL database.

# If you are going to use Kubernetes, then specify those values in the pod manifest file. Otherwise, your backend service won't be able to connect to a database
```
<br>

<h2 style=color:orange>"Success is not final, failure is not fatal: it is the courage to continue that counts."</h2><h3> - Winston Churchill</h3>