import dotenv from 'dotenv-flow';

dotenv.config();

export const { kSessionToken, kAuthorization } = process.env;

export const kIsDebug = process.env.NODE_ENV === 'development';
