// CustomEdge.tsx
import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const lines = data.label.split('\n');

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
      >
        {lines.map((line, index) => (
          <tspan key={index} x={labelX} dy={index === 0 ? 0 : '1.2em'}>
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
};

export default CustomEdge;