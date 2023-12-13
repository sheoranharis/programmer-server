resource "aws_instance" "pipline-server" {
    ami = "ami-0287a05f0ef0e9d9a"
    instance_type = "t2.micro"
    key_name = var.key-pair
    vpc_security_group_ids = [aws_security_group.pipeline-aws_security_group.id]
    associate_public_ip_address = true

    tags = {
        Name = var.pipeline-instance
    }
}

resource "aws_instance" "main-server" {
    ami = "ami-0287a05f0ef0e9d9a"
    instance_type = "t2.micro"
    key_name = var.key-pair
    vpc_security_group_ids = [aws_security_group.my-aws_security_group.id]
    associate_public_ip_address = true

    tags = {
        Name = var.main-instance
    }
}

resource "aws_security_group" "pipeline-aws_security_group" {
    name = "security-group-terraform"
    
    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 465
        to_port = 465
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 0
        to_port = 0
        protocol = -1
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
  
}

resource "aws_security_group" "my-aws_security_group" {
    name = "security-group-terraform1"
    
    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 0
        to_port = 0
        protocol = -1
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
  
}