declare const process: any;

/**
 * Environment configuration for development
 * Note: For production, create a separate environment.prod.ts
 */
export const environment = {
  production: false,
  rapidApiKey: process.env.RAPIDAPI_KEY || ''
};
