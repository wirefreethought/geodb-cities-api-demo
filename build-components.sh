#!/bin/zsh

function kebabToPascalCase()
{
  RESULT=`echo $1 | sed -e 's/-/ /g' | awk '{for (i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1' | sed 's/ //g'`

  echo $RESULT
}

BUILD_CMD=node_modules/.bin/vue-cli-service

GEO_COMPONENTS=(
  'find-admin-divisions-demo'
  'find-admin-divisions-near-division-demo'
  'find-admin-divisions-near-location-demo'
  'find-cities-demo'
  'find-cities-near-city-demo'
  'find-cities-near-division-demo'
  'find-cities-near-location-demo'
  'find-countries-demo'
  'find-country-region-cities-demo'
  'find-country-regions-demo'
  'get-admin-division-details-demo'
  'get-city-admin-region-demo'
  'get-city-date-time-demo'
  'get-city-details-demo'
  'get-city-distance-demo'
  'get-city-time-demo'
  'get-country-details-demo'
  'get-country-region-details-demo'
)

LOCALE_COMPONENTS=(
  'get-currencies-demo'
  'get-languages-demo'
  'get-locales-demo'
  'get-timezone-date-time-demo'
  'get-timezones-demo'
  'get-timezone-time-demo'
)

# shellcheck disable=SC2068
for c in ${GEO_COMPONENTS[@]}; do
  FILENAME=`kebabToPascalCase $c`.vue
  $BUILD_CMD build --target wc --name $c "src/components/geo/$FILENAME" --no-clean --dest "dist/components/geo"
done

# shellcheck disable=SC2068
for c in ${LOCALE_COMPONENTS[@]}; do
  FILENAME=`kebabToPascalCase $c`.vue
  $BUILD_CMD build --target wc --name $c "src/components/locale/$FILENAME" --no-clean --dest "dist/components/locale"
done

find dist -name '*.js' -delete

for f in `find dist -name '*.js.gz'`; do
  mv $f ${f%.gz}
done
