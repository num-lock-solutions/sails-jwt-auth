const jwt = require('jsonwebtoken');

module.exports = {


  friendlyName: 'Validate Access Token',


  description: 'Check if the supplied access token is valid',


  inputs: {

    token: {
      description: 'The access token',
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'Token verification process completed'
    }

  },


  fn: async function (inputs, exits) {
    // Run verification on supplied token, using the same secret used to sign tokens
    const options = {expiresIn: sails.config.custom.jwtExpiry};
    await jwt.verify(inputs.token, sails.config.custom.jwtSecret, options, (err, decodedToken) => {

      if (decodedToken) {
        // Access token is valid, send decoded token to the policy
        return exits.success(decodedToken);
      }
      else {
        // Access token is invalid, send the error to the policy
        return exits.success({
          error: err
        });
      }

    });

  }


};

