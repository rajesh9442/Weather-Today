declare const process: any;

/**
 * Environment configuration for production
 * Note: Ensure sensitive information is not hardcoded and is retrieved from environment variables.
 */
export const environment = {
  production: true,
  rapidApiKey: process.env.RAPIDAPI_KEY || '' // Use environment variables for sensitive data
};