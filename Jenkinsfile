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
                // sh 'cd server && npm test'
                // sh 'cd client && npm test'

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

        stage('Cleaning Up') {
            steps {
                sh "docker rmi $frontend:latest" 
                sh "docker rmi $backend:latest" 
            }
        }
	}
}

// // Define the Jenkins pipeline
// pipeline {
//     agent any // Use any available agent for running the pipeline stages

//     stages {
//         // Build stage - install dependencies and build the application
//         stage('Build') {
//             steps {
//                 // Checkout the code from the Git repository
//                 checkout scm

//                 // Install dependencies for the Node.js server and client
//                 sh 'cd server && npm install'
//                 sh 'cd client && npm install'

//                 // Build the React client
//                 sh 'cd client && npm run build'

//                 // Archive the build artifacts
//                 archiveArtifacts 'client/build/**/*'
//                 archiveArtifacts 'server/**/*'
//             }
//         }

//         // Test stage - run tests for the application
//         stage('Test') {
//             steps {
//                 // Start the MongoDB database container using Docker Compose
//                 sh 'docker-compose up -d mongodb'

//                 // Run the server and client tests
//                 sh 'cd server && npm test'
//                 sh 'cd client && npm test'

//                 // Stop the MongoDB container
//                 sh 'docker-compose down'
//             }
//         }

//         // Containerization stage - build and push Docker images for the application
//         stage('Containerization') {
//             steps {
//                 // Build the Docker images for the server and client
//                 sh 'docker build -t my-mern-app-server:latest ./server'
//                 sh 'docker build -t my-mern-app-client:latest ./client'

//                 // Tag the Docker images with the version number
//                 sh 'docker tag my-mern-app-server:latest my-mern-app-server:${env.BUILD_NUMBER}'
//                 sh 'docker tag my-mern-app-client:latest my-mern-app-client:${env.BUILD_NUMBER}'

//                 // Push the Docker images to the Docker registry
//                 withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
//                     sh 'docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}'
//                     sh 'docker push my-mern-app-server:${env.BUILD_NUMBER}'
//                     sh 'docker push my-mern-app-client:${env.BUILD_NUMBER}'
//                 }
//             }
//         }

//         // Deployment stage - deploy the application using Ansible
//         stage('Deployment') {
//             steps {
//                 // Use Ansible to deploy the application to the production server
//                 withCredentials([sshUserPrivateKey(credentialsId: 'ansible-credentials', keyFileVariable: 'SSH_PRIVATE_KEY', passphraseVariable: 'SSH_PASSPHRASE', usernameVariable: 'SSH_USERNAME')]) {
//                     sh 'ansible-playbook -i inventory/production deploy.yml --extra-vars "app_version=${env.BUILD_NUMBER}" --private-key ${SSH_PRIVATE_KEY} --user ${SSH_USERNAME}'
//                 }
//             }
//         }

//         // Logs stage - fetch and display logs from the deployed application
//         stage('Logs') {
//             steps {
//                 // Use Ansible to fetch and display logs from the production server
//                 withCredentials([sshUserPrivateKey(credentialsId: 'ansible-credentials', keyFileVariable: 'SSH_PRIVATE_KEY', passphraseVariable: 'SSH_PASSPHRASE', usernameVariable: 'SSH_USERNAME')]) {
//                     sh 'ansible -i inventory/production all -a "tail -n 100 /var/log/my-mern-app.log" --private-key ${SSH_PRIVATE_KEY} --user ${SSH_USERNAME}'
//                 }
//             }
//         }
//     }
// }