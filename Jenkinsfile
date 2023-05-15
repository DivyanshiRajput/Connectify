pipeline{
    agent any

    environment
    {
        frontend = "divyanshi2241/linkup-frontend"
        backend = "divyanshi2241/linkup-backend"
        registryCredential = "4e7af052-eef1-43a5-8beb-5264998fc9c6"
        dockerImage = ""
    }

    stages{
		stage('build') {
			steps {
                checkout scm
				sh 'cd server && npm -f install'
                sh 'cd client && npm -f install'
                sh 'cd client && npm run build'
			}
		}

        stage('Test') {
            steps {
                // Start the MongoDB database container using Docker Compose
                sh 'docker-compose up -d mongo'

                // Run the server and client tests
                sh 'cd server && npm test'

                // Stop the MongoDB container
                sh 'docker-compose down'
            }
        }

        stage('Build and Push Docker Image - frontend') {
            steps {
                script{
                    def dockerfileDir = "./client"
                    dockerImage = docker.build(frontend + ":latest", "--file ${dockerfileDir}/Dockerfile ${dockerfileDir}")
                    docker.withRegistry('', registryCredential) {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Build and Push Docker Image - backend') {
            steps {
                script{
                    def dockerfileDir = "./server"
                    dockerImage = docker.build(backend + ":latest", "--file ${dockerfileDir}/Dockerfile ${dockerfileDir}")
                    docker.withRegistry('', registryCredential) {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying locally..'
                sh 'ansible-playbook -i inventory playbook.yml'
                echo 'Done Deploying'
            }
        }

        stage('Cleaning Up') {
            steps {
                sh "docker rmi $frontend:latest" 
                sh "docker rmi $backend:latest" 
            }
        }
	}
}