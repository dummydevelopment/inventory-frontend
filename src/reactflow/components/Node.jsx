import { forwardRef } from "react";

const POSITIONS = [
  { id: "top", className: "handle-top" },
  { id: "right", className: "handle-right" },
  { id: "bottom", className: "handle-bottom" },
  { id: "left", className: "handle-left" },
];

const Node = forwardRef(
  (
    {
      id,
      x,
      y,
      label,
      actions,
      registerActionRef,
      onDragStart,
      onConnectStart,
      onConnectEnd,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="node"
        style={{
          left: x,
          top: y,
        }}
        // onMouseDown={(e) => onDragStart(id, e)}
        onMouseDown={(e) => {
          if (e.target.classList.contains("connection-point")) {
            return;
          }

          onDragStart(id, e);
        }}
        onMouseUp={() => onConnectEnd(id)}
      >
        {POSITIONS.map((p) => (
          <div
            key={p.id}
            className={`connection-point ${p.className}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              onConnectStart(id, e);
            }}
          />
        ))}

        <div>id : {id}</div>

        <div>{label}</div>

        <div className="actions">
          {actions?.map((action) => (
            <div
              key={action.id}
              ref={(el) => registerActionRef(action.id, el)}
              className="action"
            >
              <div>id : {action.id}</div>

              {action.label}

              <div
                className="connection-point action-point"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onConnectStart(action.id, e);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export default Node;
