Tactical Wall
=============
A heavily hackable web page for building wall displays with big green/red boxes. 

Set-up
---
Modify index.html to list the boxNames you want,e.g.

    wall.boxNames=['hudson_builds'];
  
Configure the scripts, e.g.

    % vi hudson_builds.properties
    url=http://hudson/.../rssLatest
    ignored=bad job|disabled job
  
Set-up your boxes by (for example), e.g.

    % crontab -e
    0,15,30,45 * * * * /home/me/tactical-wall/boxes/hudson_builds.rb > /home/me/tactical-wall/boxes/hudson_builds.json

Examples can be found in boxes/examples.
