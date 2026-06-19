import { useRef, useLayoutEffect, useState } from "react";

import Node from "./components/Node";
import Edge from "./components/Edge";
import { useEffect } from "react";

const INITIAL_NODES = [
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
        id: "1.1",
        label: "register",
        nextId: "2",
      },
      //   {
      //     id: "1.2",
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
        id: "2.1",
        label: "approve",
        nextId: "10",
      },
      {
        id: "2.2",
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
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const dragRef = useRef(null);
  const nodeRefs = useRef({});
  const actionRefs = useRef({});
  const containerRef = useRef(null);
  const [points, setPoints] = useState({});
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });
  const [connecting, setConnecting] = useState(null);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  const startDrag = (id, e) => {
    e.preventDefault();

    const node = nodes.find((n) => n.id === id);

    dragRef.current = {
      id,

      offsetX: e.clientX - node.x,

      offsetY: e.clientY - node.y,
    };
  };

  const moveDrag = (e) => {
    handleMouseMove(e);
    moveConnect(e);

    if (!dragRef.current) return;

    const { id, offsetX, offsetY } = dragRef.current;

    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,

              x: e.clientX - offsetX,

              y: e.clientY - offsetY,
            }
          : node,
      ),
    );
  };

  const stopDrag = () => {
    dragRef.current = null;
    // setConnecting(null);
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
  }, [nodes]);
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
        sourceId: node?.id,
        source: `node-${node.id}`,
        target: `node-${node.nextId}`,
        targetId: node?.nextId,
      });
    }

    // action → node
    node.actions?.forEach((action) => {
      edges.push({
        sourceId: action?.id,
        source: `action-${action.id}`,
        target: `node-${action.nextId}`,
        targetId: action?.nextId,
      });
    });
  });
  //   useEffect(() => {
  //     // console.log("edges", edges, "points", points);
  //   }, [edges, points]);
  function insertNodeBetween({ sourceId, targetId, x, y }) {
    const newId = String(Date.now());

    setNodes((prev) => {
      const updated = prev.map((node) => {
        if (node.id === sourceId) {
          return {
            ...node,
            nextId: newId,
          };
        }

        if (node.actions) {
          return {
            ...node,
            actions: node.actions.map((a) =>
              a.id === sourceId
                ? {
                    ...a,
                    nextId: newId,
                  }
                : a,
            ),
          };
        }

        return node;
      });

      updated.push({
        id: newId,
        label: "New Node",
        x,
        y,
        nextId: targetId,
      });

      return updated;
    });
  }
  function startConnect(sourceId, e) {
    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();

    setConnecting({
      sourceId,

      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,

      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  function moveConnect(e) {
    if (!connecting) return;

    const rect = containerRef.current.getBoundingClientRect();

    setConnecting((prev) => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
  }

  function finishConnect(targetId) {
    if (!connecting) return;

    if (targetId === connecting.sourceId) {
      setConnecting(null);
      return;
    }

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === connecting.sourceId) {
          return {
            ...node,
            nextId: targetId,
          };
        }

        return {
          ...node,
          actions: node.actions?.map((a) =>
            a.id === connecting.sourceId
              ? {
                  ...a,
                  nextId: targetId,
                }
              : a,
          ),
        };
      }),
    );

    setConnecting(null);
  }
  return (
    <div
      ref={containerRef}
      className="flow-container"
      onMouseMove={moveDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
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
            sourceId={edge?.sourceId}
            targetId={edge?.targetId}
            onAddNode={insertNodeBetween}
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
          onConnectStart={startConnect}
          onConnectEnd={finishConnect}
          {...node}
          onDragStart={startDrag}
          ref={(el) => {
            nodeRefs.current[node.id] = el;
          }}
          registerActionRef={(id, el) => {
            actionRefs.current[id] = el;
          }}
        />
      ))}
      {connecting && (
        <svg className="edge-layer">
          <line
            x1={connecting.startX}
            y1={connecting.startY}
            x2={connecting.x}
            y2={connecting.y}
            stroke="#1976d2"
            strokeWidth="3"
            strokeDasharray="10"
          />
        </svg>
      )}
    </div>
  );
}
