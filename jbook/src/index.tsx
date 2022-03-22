import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    const service = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm' // go to public/ folder and find a file named esbuild.wasm. We copied this file from node_modules/esbuild-wasm/
    });

    ref.current = service;

    // console.log(service);

  };


  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    // console.log(input);
    setCode(input);
    if (!ref.current) {
      return;
    }
    // console.log(ref.current);
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });

    console.log(result);

    setCode(result.outputFiles[0].text);
  };


  return (
    <div>
      <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);