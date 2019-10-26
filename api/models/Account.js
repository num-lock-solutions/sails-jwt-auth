/**
 * Account.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    
    token: {
      collection: 'accountToken',
      via: 'account'
    }

  },

  beforeCreate: function (valuesToSet, proceed) {

    // Encrypt the account password before storing it in the database
    sails.helpers.encryptPassword(valuesToSet.password).exec((err, hashedPassword) => {
      
      if (err) {
        // An error occurred whilst trying to encrypt the password
        return proceed(err);
      }
      
      // Re-assign the password string with the new encrypted password
      valuesToSet.password = hashedPassword;

      // Continue with account creation process
      return proceed();

    });
    
  },

  beforeUpdate: function (valuesToSet, proceed) {
    
    // Check if a new password string has been supplied before attempting to update the account
    if (valuesToSet.password) {
      // Encrypt the new account password before storing it in the database
      sails.helpers.encryptPassword(valuesToSet.password).exec((err, hashedPassword) => {
      
        if (err) {
          // An error occurred whilst trying to encrypt the password
          return proceed(err);
        }
        
        // Re-assign the password string with the new encrypted password
        valuesToSet.password = hashedPassword;

        // Continue with account update process
        return proceed();
  
      });
    }
    // No new password string was supplied
    else {
      // Continue with account update process
      return proceed();
    }
    
  },

  // Before retuning data from this model as JSON..
  customToJSON: function () {
    // Remove the account password hash from the result
    return _.omit(this, ['password'])
  }

};

