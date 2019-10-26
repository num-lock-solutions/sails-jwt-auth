module.exports = {


  friendlyName: 'Update Auth Credentials',


  description: 'Update the auth credentials of an account with supplied ID',


  inputs: {

    accountId: {
      description: 'ID of the existing account',
      type: 'number',
      required: true
    },
    email: {
      description: 'New email address for the existing account',
      type: 'string'
    },
    password: {
      description: 'New password for the existing account',
      type: 'string'
    }

  },


  exits: {

    badRequest: {
      description: 'An error occurred',
      responseType: 'badRequest'
    },
    success: {
      description: 'Updated account successfully',
      responseType: 'success'
    }

  },


  fn: async function (inputs, exits) {

    // Update account from the infoormation specified
    const accountUpdate = await Account.update(inputs.accountId, {
      email: inputs.email,
      password: inputs.password
    }).fetch();

    if (!accountUpdate[0]) {
      // An error occured when updating the existing account. Send a bad request response
      return exits.badRequest({
        error: 'Unable to process request. Please try again'
      });
    }

    // Remove all account access tokens from the database to log them out
    await AccountToken.destroy({
      account: accountUpdate[0].id
    });

    // Account has been updated. Return success message and let them know they need to re-log
    return exits.success({
      success: 'Account updated. Please login again with your new credentials'
    });

  }


};
