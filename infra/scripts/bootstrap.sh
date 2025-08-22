#!/bin/bash
set -e

echo "--- Starting MyKasbai Bootstrap ---"

# --- Install Dependencies ---
echo "Updating package list..."
sudo apt-get update
echo "Installing Docker, Git, and other essentials..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common git

# --- Install Docker ---
echo "Adding Docker's official GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "Adding Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

echo "Installing Docker Engine and Compose..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# --- Create Directories ---
echo "Creating required directories..."
sudo mkdir -p /var/www/html # For Let's Encrypt
sudo mkdir -p /opt/mykasbai # Main application directory
sudo chown -R $USER:$USER /opt/mykasbai

# --- Final Instructions ---
echo "--- Bootstrap Complete ---"
echo "Next steps:"
echo "1. Clone the repository into /opt/mykasbai"
echo "2. Create the .env file from .env.example"
echo "3. Run certbot to get SSL certificates: sudo certbot certonly --webroot -w /var/www/html -d mykasbai.ir"
echo "4. Copy the nginx config to /etc/nginx/sites-available/ and enable it."
echo "5. Run the deploy script: ./infra/scripts/deploy.sh"
