#!/bin/zsh

function kebabToPascalCase()
{
  RESULT=`echo $1 | sed -e 's/-/ /g' | awk '{for (i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1' | sed 's/ //g'`

  echo $RESULT
}

BUILD_CMD=node_modules/.bin/vue-cli-service

CATEGORY=$1
COMPONENT=$2

FILENAME=`kebabToPascalCase $COMPONENT`.vue
$BUILD_CMD build --target wc --name $COMPONENT "src/components/$CATEGORY/$FILENAME" --no-clean --dest "dist/components/$CATEGORY"
