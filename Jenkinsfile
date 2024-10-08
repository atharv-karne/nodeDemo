pipeline {
    agent none
    
    environment {
        DOCKER_IMAGE_NAME = 'tf-ecr-repo'
        DOCKER_IMAGE_TAG = 'latest'
        ECR_REPO_NAME = 'tf-ecr-repo' 
        AWS_REGION = 'ap-south-1'
        CONTAINER_NAME = 'tf-ecr-repo-container'
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
            def ecrImageName = "${env.ECR_REPO_URL}:${DOCKER_IMAGE_TAG}"

            echo "ECR Image Name: ${ecrImageName}"

            def image = docker.build(DOCKER_IMAGE_NAME, "-f Dockerfile .")

            withCredentials([aws(credentialsId: 'AWS-Cred', region: AWS_REGION)]) {
                sh """
                echo "Logging in to ECR here..."
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${env.ECR_REPO_URL}

                echo "Tagging Docker image here..."
                docker tag ${localImageName} ${ecrImageName}

                echo "Pushing Docker image here..."
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
                        sh "docker pull ${env.ECR_REPO_URL}:${DOCKER_IMAGE_TAG}"


                        sh "docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:${APP_PORT} ${env.ECR_REPO_URL}:${DOCKER_IMAGE_TAG}"
                        sh "docker ps | grep ${CONTAINER_NAME}"
                    }
                }
            }
        }
    }
}
