import { useState } from "react";

export default function Edge({
  sourceId,
  targetId,
  onAddNode,
  startX,
  startY,
  endX,
  endY,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const centerX = (startX + endX) / 2;
  const centerY = (startY + endY) / 2;
  return (
    <svg className="edge-layer">
      <defs>
        <marker
          id={`arrow-${sourceId}-${targetId}`}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
        </marker>
      </defs>

      <g
        style={{
          pointerEvents: "all",
        }}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        {/* invisible hit area */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="transparent"
          strokeWidth="20"
        />

        {/* visible edge */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#444"
          strokeWidth="3"
          markerEnd={`url(#arrow-${sourceId}-${targetId})`}
          pointerEvents="none"
        />

        <circle
          cx={startX}
          cy={startY}
          r="8"
          fill="#444"
          pointerEvents="none"
        />

        {showInfo && (
          <foreignObject
            x={(startX + endX) / 2 - 40}
            y={(startY + endY) / 2 - 18}
            width="80"
            height="36"
          >
            <button
              className="edge-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert("add node");
                onAddNode({
                  sourceId,
                  targetId,
                  x: centerX,
                  y: centerY,
                });
              }}
            >
              + Add
            </button>
          </foreignObject>
        )}
      </g>
    </svg>
  );
}
