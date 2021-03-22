#!/bin/sh

# Start each 6 hours

pm2 delete post-edaru
CRON="0 */6 * * *" pm2 start npm --name post-edaru  -- run start
pm2 save