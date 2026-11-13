#!/bin/bash
sudo apt update
sudo apt install mariadb-server -y
sudo service mariadb start
sudo mysql_secure_installation
sudo mysql -u root -p < ./setup_scripts/create_demo_table.sql
npm install
npm audit fix
npm start