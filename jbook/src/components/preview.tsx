import './preview.css';
import { useEffect, useRef } from "react";

interface PreveiwProps {
  code: string;
  bundlingErr: string;
}

const html = `
<html>
  <head>
    <style> html { background-color: white; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleErr = (err) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
        console.error(err);
      };

      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleErr(event.error);
      })
      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch(err) {
          handleErr(err);
        }
      }, false)
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreveiwProps> = ({ code, bundlingErr }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50)
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingErr && <div className="preview-error">{bundlingErr}</div>}
    </div>
  );
};

export default Preview;