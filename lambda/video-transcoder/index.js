"use strict";

/**
 * Created by Peter Sbarski
 * Updated by Mike Chambers
 * Updated by Julian Pittas
 * Implemented by Mantas Astrauskas
 * Last Updated: 07/07/2019
 *
 * Required Env Vars:
 * ELASTIC_TRANSCODER_REGION
 * ELASTIC_TRANSCODER_PIPELINE_ID
 */

const AWS = require("aws-sdk");

const elasticTranscoder = new AWS.ElasticTranscoder({
  region: process.env.ELASTIC_TRANSCODER_REGION
});

const handler = (event, ctx, callback) => {
  console.log("Welcome");
  console.log("event: " + JSON.stringify(event));

  // Take Pipeline ID from environment variables and Key Name from the event passed
  const pipelineId = process.env.ELASTIC_TRANSCODER_PIPELINE_ID;
  const key = event.Records[0].s3.object.key;

  // If input file has spaces, replace with "+"
  const sourceKey = decodeURIComponent(key.replace(/\+/g, " "));

  // Removes file extension
  const outputKey = sourceKey.split(".")[0];

  // Build parameters for Job pipeline.
  const params = {
    PipelineId: pipelineId,
    OutputKeyPrefix: outputKey + "/",
    Input: {
      Key: sourceKey
    },
    Outputs: [
      {
        Key: outputKey + "-1080p" + ".mp4",
        PresetId: "1351620000001-000001" //Generic 1080p
      },
      {
        Key: outputKey + "-720p" + ".mp4",
        PresetId: "1351620000001-000010" //Generic 720p
      },
      {
        Key: outputKey + "-web-720p" + ".mp4",
        PresetId: "1351620000001-100070" //Web Friendly 720p
      }
    ]
  };

  // Function call to create ElasticTranscoder Job
  return elasticTranscoder
    .createJob(params)
    .promise()
    .then(data => {
      console.log(`Elastic Transcoder callback data: ${JSON.stringify(data)}`);
      callback(null, data);
    })
    .catch(e => {
      console.log(`An error occured: ${JSON.stringify(error, null, 2)}`);
      callback(error);
    });
};

module.exports = {
  handler
};
