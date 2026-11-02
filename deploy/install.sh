#!/usr/bin/env bash
# IsoCity deploy script — Ubuntu 20.04/22.04/24.04, run with sudo
# Usage: upload gufeng-deploy.tar.gz to the server, then:
#   tar xzf gufeng-deploy.tar.gz && cd gufeng-deploy && sudo bash install.sh
set -e

if [ ! -d site ]; then echo "Please run this script inside the gufeng-deploy directory."; exit 1; fi

echo "[1/4] nginx ..."
if ! command -v nginx >/dev/null 2>&1; then
    apt-get update -y && apt-get install -y nginx
fi

echo "[2/4] copying files ..."
mkdir -p /var/www/isocity
cp -a site/. /var/www/isocity/
cp -f IsoCity-debug.apk /var/www/isocity/IsoCity-debug.apk

echo "[3/4] nginx site config ..."
cp -f isocity.nginx.conf /etc/nginx/sites-available/isocity
ln -sf /etc/nginx/sites-available/isocity /etc/nginx/sites-enabled/isocity
# Remove Ubuntu's default site so ours takes the bare-IP root path.
# If your server already hosts other sites, comment out the next line.
rm -f /etc/nginx/sites-enabled/default

echo "[4/4] test & reload ..."
nginx -t
systemctl reload nginx || systemctl restart nginx

IP=$(curl -s --max-time 5 ifconfig.me || hostname -I | awk '{print $1}')
echo "========================================"
echo "Deploy OK!"
echo "  Play in browser: http://$IP/"
echo "  Download APK:    http://$IP/IsoCity-debug.apk"
echo "If unreachable: open TCP port 80 in your cloud security group."
