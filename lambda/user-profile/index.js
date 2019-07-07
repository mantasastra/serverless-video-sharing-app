"use strict";

/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Updated by Julian Pittas
 * Implemented by Mantas Astrauskas
 * Last Updated: 07/07/2019
 *
 * Required Env Vars:
 * AUTH0_DOMAIN
 */

const rp = require("request-promise");

const generateResponse = (status, message) => {
  return {
    statusCode: status,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ message: message })
  };
};

const handler = (event, ctx, callback) => {
  console.log(JSON.stringify(event, null, 2));

  const idToken = event.headers.Authorization;
  const accessToken = event.queryStringParameters.accessToken;
  const auth0Domain = process.env.AUTH0_DOMAIN;

  if (!idToken) {
    const response = generateResponse(400, "ID Token not found");

    callback(null, response);
    return;
  }

  if (!accessToken) {
    const response = generateResponse(400, "Access Token not found");

    callback(null, response);
    return;
  }

  const options = {
    url: `https://${auth0Domain}/userinfo`,
    method: "POST",
    json: true,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  return rp(options)
    .then(body => {
      const response = generateResponse(200, body);
      callback(null, response);
    })
    .catch(e => {
      const response = generateResponse(400, e);
      callback(null, response);
    });
};

module.exports = {
  handler
};
