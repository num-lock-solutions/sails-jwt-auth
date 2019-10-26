const jwt = require('jsonwebtoken');

module.exports = {


  friendlyName: 'Sign New Access Token',


  description: 'Sign a new access token for authentication',


  inputs: {

    accountId: {
      description: 'account ID',
      type: 'number',
      required: true
    },
    email: {
      description: 'Email address of the account',
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'Token sign process completed'
    }

  },


  fn: async function (inputs, exits) {
    // Take supplied account data and sign a new access token
    const payload = { user: inputs.email };
    const options = { expiresIn: sails.config.custom.jwtExpiry };
    const token = jwt.sign(payload, sails.config.custom.jwtSecret, options);

    // Add the newly created access token to the databse and link to correct account
    await AccountToken.create({
      key: token,
      account: inputs.accountId
    });

    // Return access token
    return exits.success(token);

  }


};

