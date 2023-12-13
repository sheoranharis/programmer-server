output "pipeline-instance-id" {
    description = "Instance ID"
    value = aws_instance.pipline-server.id
}

output "pipeline-public-ip" {
  description = "Public IP address"
  value = aws_instance.pipline-server.public_ip
}

output "main-instance-id" {
    description = "Instance ID"
    value = aws_instance.main-server.id
}

output "main-public-ip" {
  description = "Public IP address"
  value = aws_instance.main-server.public_ip
}

