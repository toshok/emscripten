'''
Removes timestamp and line info from a webgl log
'''

import os, sys

lines = sys.stdin.read().split('\n')

for line in lines:
  if line.startswith('['):
    line = line[15:]
  if line.startswith(('[', ']')):
    line = line.split('@')[0]
  print line
