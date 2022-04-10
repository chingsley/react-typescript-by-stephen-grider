import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage'; // makes it easy to use indexDB. It falls back to localstorage in a browser that doesn't support indexDB

const fileCache = localForage.createInstance({
  name: 'filecache' // name of the indexDB instance created
});

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResole', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import React, { useState } from 'react';
              console.log(react, useState);
            `,
          };
        }

        // Check to see if this file is in cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        // if file in cache, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        // if file is NOT in cache, make a request to get the file
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // save result to cache and return result
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
