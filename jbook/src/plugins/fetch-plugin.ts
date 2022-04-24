// The goal of this plugin is to attempt to fetch some file

import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage'; // makes it easy to use indexDB. It falls back to localstorage in a browser that doesn't support indexDB

const fileCache = localForage.createInstance({
  name: 'filecache', // name of the indexDB instance created
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        // Check to see if this file is in cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // if file in cache, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        // if file is NOT in cache, make a request to get the file
        const { data, request } = await axios.get(args.path);
        const loader = args.path.match(/.css$/) ? 'css' : 'jsx';
        const result: esbuild.OnLoadResult = {
          loader,
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
