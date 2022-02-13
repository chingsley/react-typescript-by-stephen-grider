interface ChildProps {
  color: string;
  onClick: () => void;
}

export const Child = (props: ChildProps) => {
  const { color, onClick } = props;
  return <div>{color}  <button onClick={onClick}>Click me</button></div>
}

export const ChildASFC: React.FC<ChildProps> = (props) => {
  const { color, onClick } = props;
  return <div>{color}
    <button onClick={onClick}>Click me</button>
  </div>
}


// export const ChildASFC2: React.FunctionComponent<ChildProps> = (props) => {
//   const { color } = props;
//   return <div>{color}</div>
// }