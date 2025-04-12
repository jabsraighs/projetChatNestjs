// config/config.ts
import * as path from 'path';

export const getEnvPath = () => {
  return path.resolve(__dirname, '../.env.local');
};
