#!/bin/bash

# Launch the fly app with the copied config
fly launch --copy-config

# Scale the VM to shared-cpu-2x
fly scale vm shared-cpu-2x

# Prompt for values for each of the secrets in .env.sample
echo "Please enter your S3 credentials: (these will be added to `.env` and imported to Fly)"
read -p "ACCESS_KEY_ID: " ACCESS_KEY_ID
read -p "ACCESS_KEY_SECRET: " ACCESS_KEY_SECRET
read -p "BUCKET_NAME: " BUCKET_NAME
read -p "S3_ENDPOINT (optional): " S3_ENDPOINT
read -p "S3_REGION (optional): " S3_REGION

# Write the entered values to .env
echo "ACCESS_KEY_ID=$ACCESS_KEY_ID" > .env
echo "ACCESS_KEY_SECRET=$ACCESS_KEY_SECRET" >> .env
echo "BUCKET_NAME=$BUCKET_NAME" >> .env
echo "S3_ENDPOINT=$S3_ENDPOINT" >> .env
echo "S3_REGION=$S3_REGION" >> .env

# Upload secrets to fly
fly secrets import < .env

# Deploy the fly app
fly deploy
