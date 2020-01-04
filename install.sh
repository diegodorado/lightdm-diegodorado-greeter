#!/bin/bash
echo "Installing lightdm-webkit2-greeter arch theme..."
mkdir -p /usr/share/lightdm-webkit/themes/diegodorado
cp -R ./* /usr/share/lightdm-webkit/themes/diegodorado/
echo "Theme installed."
