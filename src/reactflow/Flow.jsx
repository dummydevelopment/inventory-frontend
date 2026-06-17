import { useRef, useLayoutEffect, useState } from "react";

import Node from "./components/Node";
import Edge from "./components/Edge";
import { useEffect } from "react";

const nodes = [
  {
    id: "0.1",
    x: 100,
    y: 150,
    label: "start",
    nextId: "1",
  },
  {
    id: "1",
    x: 100,
    y: 350,
    label: "Registeration",

    actions: [
      {
        id: "action_1",
        label: "register",
        nextId: "2",
      },
      //   {
      //     id: "action_2",
      //     label: "approve",
      //     nextId: "10",
      //   },
    ],
  },

  {
    id: "2",
    x: 600,
    y: 150,
    label: "teacher approve",
    actions: [
      {
        id: "action_21",
        label: "approve",
        nextId: "10",
      },
      {
        id: "action_22",
        label: "reject",
        nextId: "100",
      },
    ],
  },

  {
    id: "10",
    x: 600,
    y: 350,
    label: "library",
  },
  {
    id: "100",
    x: 1600,
    y: 350,
    label: "end",
  },
];

export default function Flow() {
  const nodeRefs = useRef({});
  const actionRefs = useRef({});
  const containerRef = useRef(null);
  const [points, setPoints] = useState({});
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  useLayoutEffect(() => {
    const update = () => {
      const next = {};

      const calculate = (collection, prefix) => {
        const containerRect = containerRef.current.getBoundingClientRect();

        Object.entries(collection).forEach(([id, el]) => {
          if (!el) return;

          const rect = el.getBoundingClientRect();

          next[`${prefix}-${id}`] = {
            left: rect.left - containerRect.left,

            right: rect.right - containerRect.left,

            top: rect.top - containerRect.top,

            bottom: rect.bottom - containerRect.top,

            centerX: rect.left - containerRect.left + rect.width / 2,

            centerY: rect.top - containerRect.top + rect.height / 2,
          };
        });
      };

      calculate(nodeRefs.current, "node");

      calculate(actionRefs.current, "action");

      setPoints(next);
    };

    update();

    const observer = new ResizeObserver(update);

    [
      ...Object.values(nodeRefs.current),
      ...Object.values(actionRefs.current),
    ].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  function getClosestPoints(start, end) {
    const sourcePoints = [
      { x: start.left, y: start.centerY }, // left
      { x: start.right, y: start.centerY }, // right
      { x: start.centerX, y: start.top }, // top
      { x: start.centerX, y: start.bottom }, // bottom
    ];

    const targetPoints = [
      { x: end.left, y: end.centerY },
      { x: end.right, y: end.centerY },
      { x: end.centerX, y: end.top },
      { x: end.centerX, y: end.bottom },
    ];

    let best = null;
    let min = Infinity;

    for (const s of sourcePoints) {
      for (const t of targetPoints) {
        const dist = (t.x - s.x) ** 2 + (t.y - s.y) ** 2;

        if (dist < min) {
          min = dist;

          best = {
            startX: s.x,
            startY: s.y,
            endX: t.x,
            endY: t.y,
          };
        }
      }
    }

    return best;
  }
  const edges = [];

  nodes.forEach((node) => {
    // node → node
    if (node.nextId) {
      edges.push({
        source: `node-${node.id}`,
        target: `node-${node.nextId}`,
      });
    }

    // action → node
    node.actions?.forEach((action) => {
      edges.push({
        source: `action-${action.id}`,
        target: `node-${action.nextId}`,
      });
    });
  });
  useEffect(() => {
    // console.log("edges", edges, "points", points);
  }, [edges, points]);

  return (
    <div
      ref={containerRef}
      className="flow-container"
      onMouseMove={handleMouseMove}
    >
      {/* horizontal ruler */}
      <div className="ruler-x">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i}>{i * 50}</span>
        ))}

        <div
          className="cursor-indicator-x"
          style={{
            left: cursor.x,
          }}
        />
      </div>

      {/* vertical ruler */}
      <div className="ruler-y">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i}>{i * 50}</span>
        ))}

        <div
          className="cursor-indicator-y"
          style={{
            top: cursor.y,
          }}
        />
      </div>

      {/* edges */}
      {edges.map((edge) => {
        const start = points[edge.source];
        const end = points[edge.target];

        if (!start || !end) return null;
        const closest = getClosestPoints(start, end);
        return (
          <Edge
            key={edge.source + edge.target}
            {...closest}

            // startX={start.x}
            // startY={start.y}
            // endX={end.x}
            // endY={end.y}
          />
        );
      })}

      {/* nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          {...node}
          ref={(el) => {
            nodeRefs.current[node.id] = el;
          }}
          registerActionRef={(id, el) => {
            actionRefs.current[id] = el;
          }}
        />
      ))}
    </div>
  );
}
