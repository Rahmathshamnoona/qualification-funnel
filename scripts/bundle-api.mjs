import { copyFileSync, unlinkSync } from 'node:fs'
import { build } from 'esbuild'

const names = ['health', 'lead', 'ops']

await build({
  entryPoints: names.map((name) => `api/${name}.ts`),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outdir: 'api',
  packages: 'external',
  logLevel: 'info',
})

if (process.env.VERCEL) {
  for (const name of names) {
    copyFileSync(`api/${name}.js`, `api/${name}.ts`)
    unlinkSync(`api/${name}.js`)
  }
}
