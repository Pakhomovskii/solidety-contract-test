#!/bin/bash
set -e

function wait_for_ganache() {
  echo "running Ganache..."
  while ! nc -z localhost 8545; do
    sleep 1
  done
  echo "Ganache started."
}

echo "Run ganache-cli..."
ganache-cli --gasLimit 10000000 --defaultBalanceEther 2000 --gasPrice 2000000000 --host 0.0.0.0 > ganache.log 2>&1 &

GANACHE_PID=$!

wait_for_ganache

echo "Start tests Truffle..."
truffle test

echo "Stopping ganache-cli..."
kill $GANACHE_PID
