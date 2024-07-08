#!/bin/bash
# generate-migration-cjs.sh

NAME=$1
npx sequelize-cli migration:generate --name $NAME
LATEST_JS=$(ls -t migrations | grep js | head -n 1)
mv "migrations/$LATEST_JS" "migrations/${LATEST_JS%.js}.cjs"
