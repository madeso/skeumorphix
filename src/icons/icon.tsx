
import svgDown from './chevron-circle-down.svg';
import svgRight from './chevron-circle-right.svg';

const makeReactIcon = (icon: string) => {
    return (props: {size?: number; color?: string}) => (
        <img src={icon} style={{
            display: 'inline-block',
            width: props.size ?? 16,
            height: props.size ?? 16,
            color: props.color ?? "black"
            }}/>
    );
}

export const ChevronDown = makeReactIcon(svgDown);
export const ChevronRight = makeReactIcon(svgRight);