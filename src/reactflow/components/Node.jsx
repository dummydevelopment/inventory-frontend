import { forwardRef } from "react";

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
},
ref
) => {
return (
<div
 ref={ref}
 className="node"
 style={{
 left: x,
 top: y,
}}
onMouseDown={(e) =>
onDragStart(id, e)
}
>

<div>{label}</div>

<div className="actions">
{actions?.map(
(action) => (
<div
key={action.id}
ref={(el) =>
registerActionRef(
action.id,
el
)
}
className="action"
>
{action.label}
</div>
)
)}
</div>

</div>
);
}
);
export default Node;
