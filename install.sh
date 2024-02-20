#update apt-get
sudo apt-get update

#install dependencies
sudo apt-get install nodejs
sudo apt-get install python

#backups and replace app.bundle.min.js
sudo cp -f /usr/share/jitsi-meet/app.bundle.min.js /usr/share/jitsi-meet/app.bundle.min.js.backup
sudo cp -f app.bundle.min.js /usr/share/jitsi-meet/app.bundle.min.js

#copy jitsiUploadFile middleware to /opt
sudo cp -f jitsiUploadFile /opt/jitsiUploadFile

#copy service files to system
sudo cp -f jitsiCleanFiles.service /etc/systemd/system/jitsiCleanFiles.service
sudo cp -f jitsiUploadFile.service /etc/systemd/system/jitsiUploadFile.service

#reload daemon
sudo systemctl daemon-reload

#enable services
sudo systemctl enable jitsiCleanFiles
sudo systemctl enable jitsiUploadFile
