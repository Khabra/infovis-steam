import React from "react";

// Importamos las imágenes desde assets (ajusta la ruta si es necesario)
import greenHead from "../../assets/pipe-start.png";
import greenBody from "../../assets/pipe-middle.png";
import purpleHead from "../../assets/pipe-startp.png";
import purpleBody from "../../assets/pipe-middlep.png";

const MarioPipe = (props) => {
  const { x, y, width, height, pipeColor } = props;

  // 1. Decidir qué color usar
  const isPurple = pipeColor === "purple";
  const headImg = isPurple ? purpleHead : greenHead;
  const bodyImg = isPurple ? purpleBody : greenBody;

  // 2. Definir altura de la "cabeza" de la tubería
  const HEAD_HEIGHT = 20; // Píxeles de alto de la parte superior

  // 3. Calcular altura del cuerpo (Resto de la barra)
  // Math.max(0, ...) evita errores si la barra es muy pequeñita
  const bodyHeight = Math.max(0, height - HEAD_HEIGHT);

  return (
    <g>
      {/* PARTE DE ABAJO (CUERPO) - Se estira */}
      <image
        href={bodyImg}
        x={x}
        y={y + HEAD_HEIGHT} // Empieza justo debajo de la cabeza
        width={width}
        height={bodyHeight}
        preserveAspectRatio="none" // <--- CLAVE: Esto permite que se estire sin deformarse mal
      />

      {/* PARTE DE ARRIBA (CABEZA) - Tamaño fijo */}
      <image
        href={headImg}
        x={x - 2}    // Opcional: Un poquito más a la izquierda para que se vea más ancho (efecto borde)
        y={y}
        width={width + 4} // Opcional: Un poquito más ancho que el cuerpo
        height={HEAD_HEIGHT}
        preserveAspectRatio="none"
      />
    </g>
  );
};

export default MarioPipe;