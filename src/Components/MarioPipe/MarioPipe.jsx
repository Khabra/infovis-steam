import React from "react";
import greenHead from "../../assets/pipe-start.png";
import greenBody from "../../assets/pipe-middle.png";
import purpleHead from "../../assets/pipe-startp.png";
import purpleBody from "../../assets/pipe-middlep.png";

const MarioPipe = (props) => {
  const { x, y, width, height, pipeColor } = props;

  const isPurple = pipeColor === "purple";
  const headImg = isPurple ? purpleHead : greenHead;
  const bodyImg = isPurple ? purpleBody : greenBody;

  const HEAD_HEIGHT = 20; 
  const bodyHeight = Math.max(0, height - HEAD_HEIGHT);

  return (
    <g>
      {/* CUERPO (Se estira) */}
      <image
        href={bodyImg}
        x={x}
        y={y + HEAD_HEIGHT}
        width={width}
        height={bodyHeight}
        preserveAspectRatio="none"
      />
      {/* CABEZA (Fija) */}
      <image
        href={headImg}
        x={x - 2}    
        y={y}
        width={width + 4} 
        height={HEAD_HEIGHT}
        preserveAspectRatio="none"
      />
    </g>
  );
};

export default MarioPipe;