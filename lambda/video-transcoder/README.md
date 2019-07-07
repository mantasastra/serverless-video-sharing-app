# Video Transcoder

Video transcoder function that takes a PipelineID and creates a job from the S3 event trigger

## Environment variables

ELASTIC_TRANSCODER_REGION ELASTIC_TRANSCODER_PIPELINE_ID

## Deployment

### Prerequisities

This function requires an ElasticTranscoder

### Deployment Steps

1. Run "npm install" for dependency installation
2. Run "npm run predeploy" to package the function into a zip file
3. Upload the "Lamba-Deployment.zip" to an S3 bucket using AWS Console.