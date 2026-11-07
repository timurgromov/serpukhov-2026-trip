import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const [command, target, expectedCommit] = process.argv.slice(2);
const now = () => Math.floor(Date.now() / 1000);

if (command === 'write') {
  const commit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('A full Git commit is required');
  const passport = { commit, templateVersion: '1.0.0', surface: 'static', builtAt: new Date().toISOString() };
  writeFileSync(join(target, 'deploy-version.json'), `${JSON.stringify(passport)}\n`);
  console.log(`release-passport commit=${commit} output=${target}/deploy-version.json`);
} else if (command === 'verify') {
  if (!/^[0-9a-f]{40}$/.test(expectedCommit || '')) throw new Error('Expected commit must be a full SHA');
  const started = now();
  let failure;
  for (let attempt = 0; attempt < 36; attempt += 1) {
    try {
      const url = new URL('deploy-version.json', `${target.replace(/\/$/, '')}/`);
      url.searchParams.set('release', expectedCommit);
      url.searchParams.set('attempt', String(attempt));
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
      if (!response.ok) throw new Error(`Passport HTTP ${response.status}`);
      const passport = await response.json();
      if (passport.commit !== expectedCommit) throw new Error(`Expected ${expectedCommit}, received ${passport.commit}`);
      const home = await fetch(target, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
      if (!home.ok) throw new Error(`Home HTTP ${home.status}`);
      console.log(`deploy-timing mode=pages commit=${expectedCommit} upload_s=${process.env.RELEASE_UPLOAD_SECONDS || 'unknown'} build_s=${process.env.RELEASE_BUILD_SECONDS || 'unknown'} checks_s=${now() - started} total_s=${process.env.RELEASE_STARTED ? now() - Number(process.env.RELEASE_STARTED) : 'unknown'}`);
      process.exit(0);
    } catch (error) {
      failure = error;
      if (attempt < 35) await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  throw failure;
} else {
  throw new Error('Usage: node scripts/release-passport.mjs write <output> | verify <url> <commit>');
}
