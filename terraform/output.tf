output "instance-id" {
    description = "Instance ID"
    value = aws_instance.pipline-server.id
}

output "public-ip" {
  description = "Public IP address"
  value = aws_instance.pipline-server.public_ip
}
