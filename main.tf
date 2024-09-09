provider "aws" {
  region = "ap-south-1"
}

resource "aws_ecr_repository" "tf_ecr_repo" {
    name = "tf-ecr-repo"
    force_delete = true
}

output "ecr_url" {
    value = aws_ecr_repository.tf_ecr_repo.repository_url
  
}