module.exports = async function(req, res, next) {
    
    'use strict';

    // Check if auth token has been sent as part of the request headers
    if (!req.headers.authorization) {
        // No auth token supplied, deny access
        res.forbidden({
            error: 'Access token missing. Please try again'
        });
    }

    // Get auth token from the request
    const token = req.headers.authorization.split('Bearer ')[1];

    // Socket conection specific function
    if (req.isSocket) {
        // Check if an access token has been sent as part of the request header
        if (token) {
            // An access token was found, validate it
            const validatedToken = await sails.helpers.validateJwt(token);

            if (validatedToken.error) {
                // The access token is invalid or expired
                res.forbidden({
                    error: 'Access token invalid. Please try again'
                });
            }
            else {
                // The token is valid, check to see if it belongs to a user's account
                const accountToken = await AccountToken.findOne({
                    key: token
                }).populateAll();
    
                if (!accountToken) {
                    // The token doesn't exist in our database
                    res.forbidden({
                        error: 'Access token invalid. Please try again'
                    });
                }
                else if (validatedToken.user === accountToken.account.email) {
                    // The token belongs to a user's account and is active, continue processing request
                    next();
                }
                else {
                    // The token is in the database, but is not linked to any user's account. Let's delete it and deny access
                    await AccountToken.destroy(accountToken);
                    res.forbidden({
                        error: 'Access token invalid. Please try again'
                    });
                }
            }

        }
        else {
            // No access token was supplied with the request, what were they thinking?
            res.forbidden({
                error: 'Access token must be supplied'
            });
        }

    }
    // HTTP conection specific function
    else {
        // Check if an access token has been sent as part of the request header
        if (token) {
            // An access token was found, validate it
            const validatedToken = await sails.helpers.validateJwt(token);

            if (validatedToken.error) {
                // The access token is invalid or expired
                res.forbidden({
                    error: 'Access token invalid. Please try again'
                });
            }
            else {
                // The token is valid, check to see if it belongs to a user's account
                const accountToken = await AccountToken.findOne({
                    key: token
                }).populateAll();
                
                if (!accountToken) {
                    // The token doesn't exist in our database
                    res.forbidden({
                        error: 'Access token invalid. Please try again'
                    });
                }
                else if (accountToken.account && validatedToken.user === accountToken.account.email) {
                    // The token belongs to a user's account and is active, continue processing request
                    next();
                }
                else {
                    // The token is in the database, but is not linked to any user's account. Let's delete it and deny access
                    await AccountToken.destroy(accountToken);
                    res.forbidden({
                        error: 'Access token invalid. Please try again'
                    });
                }
            }

        }
        else {
            // No access token was supplied with the request, what were they thinking?
            res.forbidden({
                error: 'Access token must be supplied'
            });
        }

    }

};