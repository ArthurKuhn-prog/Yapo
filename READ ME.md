######################## YAPO - Yet Another Portfolio Outil ########################

#########################################################################
WHAT'S YAPO ?

YAPO is a CMS ongoing project mainly thought for creating artists' portfolios. 
It is developped by I, Arthur Kuhn, a french contemporary artist and self-taught web developper.
I've started it late 2019, and made a few versions of it before the first (french) lockdown early 2020 where I rewrote it entirely using Vue.js

Its built upon a mixture of Javascript (Vue.js, mainly) for the front-end and PHP (mainly) for the back-end. I plan on keeping it that way, not using Node.js or any framework that would require a custom PHP installation server-wise, because I want it to be usable on shared (and cheap) hosting solutions.

#########################################################################
VERSION NOTES - v0.5

I wouldn't recommend installing it by yourself right now. 
It DOES work, and there are a few websites floating around right now using it, without their owners screaming at me every day, so I guess it's as good as it needed for the time being (my own website uses it, and it does what I want fine).

But still, you'd need to get your hands dirty going into the belly of the beast for some very non-intuitive changes before getting it to work, and I feel like its time I take it to the next level.

#########################################################################
KNOWN ISSUES AND v0.6 GOALS

- Broad goals and general cleaniness of code :
1. Speaking english
As of now, all of YAPO's code is written in a beautiful and poetic yet unorthodox mixture of french and english. Frenglish, if you will. And a few of its comments are basically jokes I made to myself while coding in order to retain a bit of sanity and joie de vivre. I need to change that.

2. Reorganising code to make it more evolutive
Having used YAPO for a few months now, I definitely feel like its architecture is way too messy and needs to be rearranged in order to be more easily adapted and changed over the course of its future life.

3. Make the whole category system optionnal
While I stand by my decision of organizing your content through categories because I know that it resonates with how most artists will likely want to proceed, I feel like my original idea of making it mandatory for a page to be connected to one is a bit too harsh. Also I use to have the possibility of changing a page's category available, but got rid of it due to technical issues. Time for the big come back.

- A farandole gourmande of technical issues :
1. When retrieving the content, YAPO tends to randomize the order in which it is presented. I'm pretty sure it comes from the AJAX calls, suffering from random bits of latency on the server side. It needs to be fixed.

2. The home url of the website is needed on basically every page to retrieve bits of code. It is now written in a javascript local session storage, which then needs to be send and duplicated by every Vue instance, creating unnecessary redundancies that creeps me out. Also is the main thing I have to hard-code change every time I install a new website.

3. Better use of PHP sessions for security. Their lifespan is a bit erratic, which once again probably comes from me poorly understanding the session system I put in place.

4. No update status while loading a file from your computer on your site.This is something every person using YAPO as asked me to implement, including myself. Get to work, dude !

5. Implementing multi-users possibility.

6. Better use of error messages from PHP to Js when making AJAX calls. That actually has already been started on a yet-to-be-revealed first work on the thing.

#########################################################################
THAT'S ALL, FOLKS !

If you ever are interested in downloading YAPO, be it for your own use or to offer me your help or just havea look at what I've made, feel free to do so : the plan is to keep this thing open source !

Thanks !
