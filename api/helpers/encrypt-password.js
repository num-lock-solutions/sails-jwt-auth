const bcrypt = require('bcrypt');

module.exports = {


  friendlyName: 'Encrypt password',


  description: 'Encrypt a password string',


  inputs: {

    password: {
      description: 'Password string supplied',
      type: 'string',
      required: true
    }

  },


  exits: {

    badRequest: {
      description: 'Failed to encrypt the supplied password string'
    },
    success: {
      description: 'Encrypted password string successfully'
    }

  },


  fn: async function (inputs, exits) {
    // Encrypt the supplied password string, using JWT salt config setting
    bcrypt.hash(inputs.password, sails.config.custom.jwtSalt, function(err, hashedPassword) {
      
      if (err) {
        // An error occurred when attempting to encrypt the supplied password string. Return an error
        return exits.badRequest({
          error: 'Unable to encrypt password string'
        });
      }
      else {
        // Encryption process complete. Return the password hash
        return exits.success(hashedPassword);
      }

    });
  }


};

