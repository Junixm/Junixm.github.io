export default function ExampleGrid({ cells }) {
  return <div className="example-grid">
    {cells.map((row, r) => row.map((v, c) => <div key={`${r}:${c}`} className={`example-cell ${v !== '-' ? 'filled' : ''}`}>{v !== '-' ? v : ''}</div>))}
  </div>;
}
