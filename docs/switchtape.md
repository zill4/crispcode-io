# SWITCHTAPE
11/03/24
![Switchtapelogo](https://github.com/zill4/crispcode-io/blob/main/media/switchtape-logo-black.png?raw=true)
I’ve made a new project out of inconvenience. I love listening to music while I work and usually that entails me making big playlists for fitting my mood. For this I usually use Spotify, they have a great library of music, and it’s easy to see what my friends are listening to, and share what I’m listening to with them. 

However, I just discovered how much better of a listening experience Apple Music is. All of my playlists live on Spotify though, and manually recreating them would not be an option since some of my playlists have hundreds of songs in them. I found some services online that can transfer playlists for you, but they charge you if you try to transfer more than 100 songs.

So I made this app, Switchtape. All it does right now is transfer music from Spotify to Apple Music or vice versa. I’ll probably add more to it in the future, but it was a great learning experience  as well.

The app is built with Deno 2.0 which is basically a quicker, more secure, version of NodeJS.  Leaning into speed I also decided to use Astro with Preact for my frontend framework. Astro is awesome because it is extremely lightweight and quick, it basically removes most of all the javascript that gets loaded on other frameworks that use a VirtualDOM. I am using Preact, which is basically lightweight minimal react. The cool thing about Astro is you can load components built with Preact only where necessary, conceptually it’s known as an island.

For the backend I’ve opted to use Firebase since it’s easy, and all I really need was the hosting and some cloud functions to handle auth requests for Apple and Spotify. 

In the future…

I want to add support for transferring to and from YouTube Music and a user profile sharing your playlists agnostically to anyone. I.e. People can share their music across any platform and it shouldn’t require the user to log in to more than one provider to save the playlist.