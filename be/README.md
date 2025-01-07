# Project Setup with TypeScript

This guide will help you set up a TypeScript project with the necessary configurations and dependencies.

## Steps

### 1. Install TypeScript

First, install TypeScript as a development dependency:

```bash
npm install typescript --save-dev
```

### 2. Initialize TypeScript Configuration

Next, initialize the TypeScript configuration file (`tsconfig.json`):

```bash
npx tsc --init
```

### 3. Configure `tsconfig.json`

Open the generated `tsconfig.json` file and set the `rootDir` and `outDir` options:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

### 4. Install Node.js Type Definitions

Install the Node.js type definitions as a development dependency:

```bash
npm install @types/node --save-dev
```

## Summary

By following these steps, you will have a TypeScript project set up with the following configurations:

- TypeScript installed as a development dependency.
- A `tsconfig.json` file with `rootDir` set to `./src` and `outDir` set to `./dist`.
- Node.js type definitions installed.

You are now ready to start writing TypeScript code in the `src` directory and compile it to the `dist` directory.
```
