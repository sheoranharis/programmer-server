variable "my-region" {
    description = "AWS Region"
    type = string
    default = "ap-south-1"
}

variable "my-instance" {
    description = "EC2 Instance name"
    type = string
    default = "Pipeline Server"
}

variable "key-pair" {
    description = "Key Pair  for SSH"
    type = string
    default = "my-key"
}
