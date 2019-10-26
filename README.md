# Sails.js JSON Web Token Authentication System

Based on Passport/[Waterlock](https://github.com/waterlock/waterlock) JSON web token authentication system for [Sails](https://sailsjs.com), created to support version 1 of Sails.js

This package currently supports MySQL databases out of the box, but can be changed by viewing the Sails [documentation](https://sailsjs.com/documentation/reference/configuration/sails-config-datastores)


### Installation

+ Clone the repo into a desired directory
+ Create a new database and database credentials
+ Update "api/config/datastores.js" with the new database credentials
+ Open "api/config/custom.js" and change the JWT settings (JWT secret string, expiry and encryption level)
+ [Lift your app](https://sailsjs.com/get-started)!

### Notes

+ To help with development, we recommend using [Nodemon](https://www.npmjs.com/package/nodemon) to automatically restart your app when file changes are detected. Instead of using "sails lift", use "nodemon app.js" instead in the console to lift your app.
