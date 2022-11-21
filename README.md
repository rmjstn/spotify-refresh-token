
# Get a Spotify refresh token

Spotify tokens expire after one hour. You have to use a refresh token (obtained with your client id and client secret) to get a new access token.

This application allows you to get a refresh token through the [authorization code flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

You can then use this refresh token in batch scripts for example to obtain access tokens.

## Create a Spotify App

First you have to create an App by visiting the [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard/applications).
Note the *client ID* and the *client Secret*.
On the *Edit settings* tab add this *Redirect URIs* : *http://localhost:8888/callback*

## Configure the application

In the *app.js* file insert the *client ID* and the *client Secret* (lines 8 and 9).

In the *app.js* file insert the authorizations in the *scope* variable (line 29)

## Start the application

Run the following commands :
> npm install
> npm start

## Get a refresh token

Open the URL http://localhost:8888/ in a browser.

By visiting the link [Login with Spotify](http://localhost:8888/login) you are prompted to sign in to Spotify.
Following this, the Redirect URI (*http://localhost:8888/callback*) is requested.

The server console displays the tokens and user informations.

## Get a new token

By visiting the link [Obtain a new token using the refresh token](http://localhost:8888/refresh_token?refresh_token=) you get a new token with a validity of one hour.

The server console displays the tokens informations.
