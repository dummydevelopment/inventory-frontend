export default function Edge({ startX, startY, endX, endY }) {
  return (
    <svg className="edge-layer">
      {/* Arrow definition */}
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
        </marker>
      </defs>

      {/* line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#444"
        strokeWidth="3"
        markerEnd="url(#arrow)"
      />

      {/* start point */}
      <circle cx={startX} cy={startY} r="6" fill="#444" />
    </svg>
  );
}
