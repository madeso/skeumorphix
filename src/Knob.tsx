import React, { useRef, useState } from 'react';
import './Knob.css';

interface KnobProps {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  size?: number;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

export const Knob: React.FC<KnobProps> = ({
  min = 0,
  max = 100,
  value = 50,
  step = 1,
  size = 50,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const knobRef = useRef<HTMLDivElement>(null);
  const angleRange = 270;
  const startAngle = 135;

  const outerStroke = size * 0.02;
  const outerRadius = size / 2 - size * 0.08;
  const innerRadius = size / 2 - size * 0.20;
  const ellipseYOffset = size * 0.08;
  const ellipseRx = size / 2 - size * 0.24;
  const ellipseRy = size / 2 - size * 0.28;
  const pointerLength = ellipseRx;
  const pointerWidth = size * 0.04;

  const valueToAngle = (val: number) => {
    return startAngle + ((val - min) / (max - min)) * angleRange;
  };

  const handlePointerDown = (orig: React.PointerEvent) => {
    const initial = internalValue;

    const move = (ev: PointerEvent) => {
      const dy = (orig.clientY - ev.clientY);
      const change = dy * ((max - min) / size);
      const newValue = initial + change;
      const clamped = clamp(Math.round(newValue / step) * step, min, max);
      setInternalValue(clamped);
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div
      className="skeumorphic-knob"
      ref={knobRef}
      style={{ width: size, height: size }}
      onPointerDown={handlePointerDown}
    >
      <svg width={size} height={size}>
        <defs>
          <radialGradient id="knobGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#bbb" />
          </radialGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="url(#knobGradient)"
          stroke="#888"
          strokeWidth={outerStroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="#eee"
        />
        <ellipse
          cx={size / 2}
          cy={size / 2 + ellipseYOffset}
          rx={ellipseRx}
          ry={ellipseRy}
          fill="#fff"
          opacity="0.3"
        />
        {(() => {
          const angle0 = valueToAngle(min);
          const angle1 = valueToAngle(internalValue);
          const r = pointerLength;
          const cx = size / 2;
          const cy = size / 2;
          const x0 = cx + r * Math.cos((angle0 - 90) * Math.PI / 180);
          const y0 = cy + r * Math.sin((angle0 - 90) * Math.PI / 180);
          const x1 = cx + r * Math.cos((angle1 - 90) * Math.PI / 180);
          const y1 = cy + r * Math.sin((angle1 - 90) * Math.PI / 180);
          const delta = angle1 - angle0;
          const largeArc = Math.abs(delta) > 180 ? 1 : 0;
          return (
            <path
              d={`M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1}`}
              stroke="#2196f3"
              strokeWidth={pointerWidth * 0.7}
              fill="none"
            />
          );
        })()}
        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2 + pointerLength * Math.cos((valueToAngle(internalValue) - 90) * Math.PI / 180)}
          y2={size / 2 + pointerLength * Math.sin((valueToAngle(internalValue) - 90) * Math.PI / 180)}
          stroke="#333"
          strokeWidth={pointerWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
