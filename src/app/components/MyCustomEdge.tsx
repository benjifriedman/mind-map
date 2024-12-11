import { getBezierPath, EdgeProps } from 'reactflow';

const MyCustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        onClick={(event) => data.onClick(event, { id, sourceX, sourceY, targetX, targetY })}
      />
      <text style={{ fontSize: '1.125rem' }}> {/* 1.125rem corresponds to text-lg in Tailwind CSS */}
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {data.label}
        </textPath>
      </text>
    </>
  );
};

export default MyCustomEdge;
