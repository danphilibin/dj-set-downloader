#!/bin/bash

# Copy fly.toml.sample to fly.toml
cp fly.toml.sample fly.toml

# Launch the fly app with the copied config
fly launch --copy-config

# Scale the VM to shared-cpu-2x
fly scale vm shared-cpu-2x

# Prompt for values for each of the secrets in .env.sample
echo "Please enter the values for the secrets in .env.sample:"
read -p "ACCESS_KEY_ID: " ACCESS_KEY_ID
read -p "ACCESS_KEY_SECRET: " ACCESS_KEY_SECRET
read -p "BUCKET_NAME: " BUCKET_NAME
read -p "S3_ENDPOINT: " S3_ENDPOINT
read -p "S3_REGION: " S3_REGION

# Write the entered values to .env
echo "ACCESS_KEY_ID=$ACCESS_KEY_ID" > .env
echo "ACCESS_KEY_SECRET=$ACCESS_KEY_SECRET" >> .env
echo "BUCKET_NAME=$BUCKET_NAME" >> .env
echo "S3_ENDPOINT=$S3_ENDPOINT" >> .env
echo "S3_REGION=$S3_REGION" >> .env

# Deploy the fly app
fly deploy
