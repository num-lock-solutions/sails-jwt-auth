module.exports = {


  friendlyName: 'Account Logout',


  description: 'Logout an account and remove all access tokens',


  inputs: {

  },


  exits: {

    badRequest: {
      description: 'An error occurred',
      responseType: 'badRequest'
    },
    success: {
      description: 'Logout successful',
      responseType: 'success'
    }

  },


  fn: async function (inputs, exits) {

    // Get access token from request header
    const token = this.req.headers.authorization.split('Bearer ')[1];

    // Remove supplied access token from the database
    const destroyAccountToken = await AccountToken.destroy({
      key: token
    }).fetch();

    if (!destroyAccountToken[0]) {
      // Access token could not be found in the database. Unable to logout
      return exits.badRequest({
        error: 'Access token invalid'
      });
    }

    // Return success message
    return exits.success({
      success: 'Logout Successful'
    });

  }


};
