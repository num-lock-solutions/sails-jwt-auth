const bcrypt = require('bcrypt');

module.exports = {


  friendlyName: 'Register Account',


  description: 'Process account registration',


  inputs: {

    email: {
      description: 'The email address of the account',
      type: 'string',
      required: true
    },
    password: {
      description: 'The password of the account',
      type: 'string',
      required: true
    }

  },


  exits: {

    badRequest: {
      description: 'An error occurred',
      responseType: 'badRequest'
    },
    forbidden: {
      description: 'Incorrect credentials supplied',
      responseType: 'forbidden'
    },
    success: {
      description: 'Registered account successfully',
      responseType: 'success'
    }

  },


  fn: async function (inputs, exits) {

    // See if an account already exists with the supplied email address, otherwise create one
    await Account.findOrCreate({
      email: inputs.email
    }, {
      email: inputs.email,
      password: inputs.password
    }).exec(async(err, account, created)=> {
      
      if (err) {
        // An error occured when searching database. Send a bad request response
        return exits.badRequest({
          error: 'Unable to process request. Please try again'
        });
      }
      else if (created) {
        // The account didn't exist, so a new one has been created. Generate an access token
        const token = await sails.helpers.signJwt(account.id, account.email);
        
        // Return the new account ID and access token as a reponse
        return exits.success({
          accountId: account.id,
          token: token
        });
      }
      else {
        // An account was found matching the emaill address specified. Comparing the supplied password with the stored password for this account
        await bcrypt.compare(inputs.password, account.password).then(async function (match) {

          if (!match) {
            // Password doesn't match the stored password for the account
            return exits.unauthorized({
              error: 'Incorrect credentials supplied. Please try again'
            });
          }
          
          // Passwords match, remove all other access tokens stored in the database
          await AccountToken.destroy({
            account: account.id
          });
  
          // Generate a new access token for this account
          var token = await sails.helpers.signJwt(account.id, account.email);
          
          // Return the account ID and access token
          return exits.success({
            accountId: account.id,
            token: token
          });
    
        });
      }
    
    });

  }

};
