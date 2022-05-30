import * as path from 'path';
import * as dotenv from 'dotenv';

const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const config:ProcessEnv = <any>process.env

export default config;
