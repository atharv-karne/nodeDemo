pipeline {
    agent none
    
    environment {
        DOCKER_IMAGE_NAME = 'my-node-app'
        DOCKER_IMAGE_TAG = 'latest'
        ECR_REPO_NAME = 'tf-ecr-repo' 
        AWS_REGION = 'ap-south-1'
        CONTAINER_NAME = 'my-node-app-container'
        APP_PORT = '3000'
        ECR_REPO_URL = "730335267178.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"
    }
    
    stages {
        stage('Infra_apply') {
            agent any
            steps {
                script {
                    withCredentials([aws(credentialsId: 'AWS-Cred', region: AWS_REGION)]) {
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve'
                        echo "ECR Repository URL: ${env.ECR_REPO_URL}"
                    }
                }
            }
        }
        
stage('Docker Image build and push') {
    agent any
    steps {
        script {
            def localImageName = "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            def ecrImageName = "${env.ECR_REPO_URL}/my-node-app:${DOCKER_IMAGE_TAG}"

            echo "Local Image Name: ${localImageName}"
            echo "ECR Image Name: ${ecrImageName}"

            def image = docker.build(localImageName, "-f Dockerfile .")

            withCredentials([aws(credentialsId: 'AWS-Cred', region: AWS_REGION)]) {
                sh """
                echo "Logging in to ECR..."
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${env.ECR_REPO_URL}

                echo "Tagging Docker image..."
                docker tag ${localImageName} ${ecrImageName}

                echo "Listing local Docker images:"
                docker images

                echo "Pushing Docker image..."
                docker push ${ecrImageName}
                """
            }
        }
    }
}


        
        stage('Deploy container') {
            agent any
            steps {
                script {
                    withCredentials([aws(credentialsId: 'AWS-Cred', region: AWS_REGION)]) {
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${env.ECR_REPO_URL}"
                        sh "docker pull ${env.ECR_REPO_URL}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

                        sh "docker stop ${CONTAINER_NAME} || true"
                        sh "docker rm ${CONTAINER_NAME} || true"

                        sh "docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:${APP_PORT} ${env.ECR_REPO_URL}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                        sh "docker ps | grep ${CONTAINER_NAME}"
                    }
                }
            }
        }
    }
}
