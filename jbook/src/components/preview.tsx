import { useState, useEffect, useRef } from "react";

interface PreveiwProps {
  code: string;
}

const html = `
<html>
  <head></head>
  <body>
    <div id="root"></div>
    <script>
      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch(err) {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        }
      }, false)
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreveiwProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html; // html is declared below, before the 'return'
    iframe.current.contentWindow.postMessage(code, '*');
    // iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }, [code]);

  return (
  <iframe
    title="preview"
    ref={iframe} 
    sandbox="allow-scripts" 
    srcDoc={html}
   />
  )
};

export default Preview;