packer {
  required_plugins {
    amazon = {
      version = ">= 1.3.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "region" {
  type    = string
  default = "eu-west-1"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0221a6d0d63ae5e5b"
}

variable "instance_type" {
  type    = string
  default = "c7i.2xlarge"
}

variable "runner_version" {
  description = "GitHub Actions runner version (no v prefix)"
  type        = string
  default     = "2.322.0"
}

variable "node_version" {
  type    = string
  default = "20.15.0"
}

variable "yarn_lock_hash" {
  type    = string
  default = "manual"
}

source "amazon-ebs" "runner" {
  ami_name      = "gha-runner-al2023-x64-${formatdate("YYYYMMDDhhmm", timestamp())}-${var.yarn_lock_hash}"
  instance_type = var.instance_type
  region        = var.region
  subnet_id     = var.subnet_id

  source_ami_filter {
    filters = {
      name                = "al2023-ami-2023.*-x86_64"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["137112412989"]
  }

  launch_block_device_mappings {
    device_name           = "/dev/xvda"
    volume_size           = 100
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = true
  }

  ssh_username            = "ec2-user"
  temporary_key_pair_type = "ed25519"

  tags = {
    Name           = "gha-runner-al2023"
    yarn_lock_hash = var.yarn_lock_hash
    managed_by     = "packer"
  }
}

build {
  sources = ["source.amazon-ebs.runner"]

  # Everything runs as root to avoid sudo issues
  provisioner "shell" {
    execute_command = "sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
    inline = [
      "dnf update -y",
      "dnf install -y docker git jq tar gzip unzip gcc-c++ make python3 python3-pip",
      "dnf install -y xorg-x11-server-Xvfb gtk3 nss alsa-lib libXScrnSaver libXtst",
      "dnf install -y java-21-amazon-corretto-headless",
      "systemctl enable docker",
      "systemctl start docker",
      "usermod -aG docker ec2-user",

      # AWS CLI v2
      "curl -fsSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscliv2.zip",
      "unzip -q /tmp/awscliv2.zip -d /tmp",
      "/tmp/aws/install",
      "rm -rf /tmp/aws /tmp/awscliv2.zip",

      # GitHub CLI
      "dnf install -y 'dnf-command(config-manager)'",
      "dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo || dnf-3 config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo",
      "dnf install -y gh",

      # GitHub Actions runner
      "mkdir -p /opt/actions-runner",
      "curl -fL https://github.com/actions/runner/releases/download/v${var.runner_version}/actions-runner-linux-x64-${var.runner_version}.tar.gz | tar xz -C /opt/actions-runner",
      "chown -R ec2-user:ec2-user /opt/actions-runner",
    ]
  }

  # Node.js via nvm (as ec2-user)
  provisioner "shell" {
    inline = [
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash",
      "source ~/.nvm/nvm.sh && nvm install ${var.node_version} && nvm alias default ${var.node_version}",
      "source ~/.nvm/nvm.sh && corepack enable",
    ]
  }

  # Warm yarn/node_modules cache (as ec2-user)
  provisioner "shell" {
    inline = [
      "source ~/.nvm/nvm.sh",
      "cd /tmp && git clone --depth 1 https://github.com/island-is/island.is.git",
      "cd /tmp/island.is && yarn install --immutable",
      "sudo mkdir -p /opt/warm-cache",
      "sudo cp -r /tmp/island.is/.yarn/cache /opt/warm-cache/yarn-cache",
      "sudo cp -r /tmp/island.is/node_modules /opt/warm-cache/node_modules",
      "sudo chown -R ec2-user:ec2-user /opt/warm-cache",
      "rm -rf /tmp/island.is",
    ]
  }

  # Cleanup
  provisioner "shell" {
    execute_command = "sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
    inline = [
      "docker system prune -af || true",
      "dnf clean all",
      "rm -rf /tmp/* /var/tmp/*",
    ]
  }
}
