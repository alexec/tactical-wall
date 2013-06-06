#! /bin/sh
set -ue

cd $(dirname $0)

./review_board.rb | tee review_board.json
./hudson_builds.rb | tee hudson_builds.json

