/**
 * Jest global setup file — loaded before any test module.
 *
 * Explicitly loads backend/.env so that local Jest runs always use
 * the local development database (localhost:5433) and never try to
 * reach the Docker-only "db" hostname.
 *
 * The `override: false` option means values already set in the shell
 * environment take precedence — CI can still inject its own DB config
 * without being overridden by the file.
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

config({
  path: resolve(__dirname, '../.env'),
  override: false, // shell environment variables take precedence
});
