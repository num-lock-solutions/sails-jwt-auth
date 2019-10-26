const bcrypt = require('bcrypt');

module.exports = {


  friendlyName: 'Account Login',


  description: 'Process account login',

  
  inputs: {

    email: {
      description: 'The email address provided by the user',
      type: 'string',
      required: true
    },
    password: {
      description: 'The password provided by the user',
      type: 'string',
      required: true
    }

  },


  exits: {

    notFound: {
      description: 'No account found',
      responseType: 'notFound'
    },
    success: {
      description: 'Login successful',
      responseType: 'success'
    },
    unauthorized: {
      description: 'Could not authenticate account',
      responseType: 'unauthorized'
    }

  },


  fn: async function (inputs, exits) {

    // Get account matching supplied email address from the database
    const account = await Account.find({
      email: inputs.email
    });

    if (!account[0]) {
      // If the account doesn't exist, send "account not found" error
      return exits.notFound({
        error: 'No account found with that email address. Please try again'
      });
    }

    // An account matching the email address supplied has been found. Check that the password supplied matches what is stored in the database
    await bcrypt.compare(inputs.password, account[0].password).then(async function (match) {

      if (match) {
        // Passwords match, remove all other access tokens stored in the database
        await AccountToken.destroy({
          account: account[0].id
        });

        // Generate a new access token for this account
        const token = await sails.helpers.signJwt(account[0].id, account[0].email);
        
        // Return the account ID and access token
        return exits.success({
          accountId: account[0].id,
          token: token
        });
      }
      else {
        // Password doesn't match the stored password for the account
        return exits.unauthorized({
          error: 'Incorrect credentials supplied. Please try again'
        });
      }

    });

  }


};
