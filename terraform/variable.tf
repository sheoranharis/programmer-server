variable "my-region" {
    description = "AWS Region"
    type = string
    default = "ap-south-1"
}

variable "pipeline-instance" {
    description = "EC2 Instance name"
    type = string
    default = "Pipeline Server"
}

variable "main-instance" {
    description = "EC2 Instance name"
    type = string
    default = "Main Server"
}

variable "key-pair" {
    description = "Key Pair  for SSH"
    type = string
    default = "my-key"
}
