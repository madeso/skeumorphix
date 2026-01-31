import euphoriaLogo from '/euphoria-logo.svg'
import './App.css'
import { colors, type ColorName } from './colors';
import React from 'react';
import { ChevronDown, ChevronRight } from './icons/icon';

const noiseTexture = (name: ColorName, top: number, bottom: number) => {
  const topHex = colors[name][top];
  const bottomHex = colors[name][bottom];

  const style = {
    '--top': topHex,
    '--bottom': bottomHex
  } as React.CSSProperties;
  return style;
}

const Editor = (props: React.PropsWithChildren) => {
  return <div className='editor' style={noiseTexture("gray", 3, 5)}>
    {props.children}
    <Border id="a"/>
    <Border id="b"/>
    <Border id="c"/>
  </div>;
}

const Border = (props: {id: string}) => <div id={props.id} className='border'/>

const ComponentList = (props: React.PropsWithChildren) => <div className='component-list'>
  {props.children}
</div>;

const Component = (props: {
  color: ColorName;
  title?: React.ReactNode | undefined;
  children?: React.ReactNode | undefined;
}) => {
  const [expanded, setExpanded] = React.useState(true);
  return <div className='component'>
    <Title color={props.color} expanded={expanded} toggleExpanded={() => {
      setExpanded(prev => !prev);
    }}>
      {props.title}
    </Title>
    <Body color={props.color}>
      {expanded && props.children}
    </Body>
  </div>;
};

const SystemList = (props: React.PropsWithChildren) => <div className='system-list'>
  {props.children}
</div>;

const Title = (props: {
  color: ColorName;
  children?: React.ReactNode | undefined;
  expanded: boolean;
  toggleExpanded: () => void;
}) => <div className="title" style={noiseTexture(props.color, 3, 6)}>
  <a onClick={props.toggleExpanded}>{props.expanded ? <ChevronDown/> : <ChevronRight/>}</a>
  {props.children}
</div>;

const Body = (props: {
  color: ColorName;
  title?: React.ReactNode | undefined;
  children?: React.ReactNode | undefined;
}) => {
  return <div className="body" style={noiseTexture(props.color, 3, 8)}>
    {props.children}
  </div>;
}
const Prop = (props: {label: string; children?: React.ReactNode}) => <>
  {props.children}
  <div>{props.label}</div>
</>

const Toggle = (props: {checked: boolean, onChange: ()=>void}) => {
  return (
    <label className="rocker-toggle">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        style={{ display: 'none' }}
      />
      <span className="rocker-bg">
        <span className="rocker-knob" />
      </span>
    </label>
  );
}

const NumberEdit = () => {
  const inputWidget = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(0);
  const step = 1;
  const [editing, setEditing] = React.useState(false);
  return (
    <span className="led-number-edit">
      <span className="led-display" onClick={() => {
        setEditing((last) => {
          const next = !last;
          if(next && inputWidget.current) {
            inputWidget.current.focus();
            inputWidget.current.select();
            return next;
          }
          return last;
        });
      }}>
        {!editing && String(value).padStart(3, '0')}
        <input
          ref={inputWidget}
          width={editing?undefined:0}
          height={editing?undefined:0}
          type={editing ? "text" : "hidden"}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="led-input"
          onBlur={() => {
            setEditing(false);
          }}
        />
        <button
          className="led-stepper led-stepper-inc"
          type="button"
          onClick={e => { e.stopPropagation(); setValue(v => v + step); }}
          aria-label="increment"
        >
          +
        </button>
        <button
          className="led-stepper led-stepper-dec"
          type="button"
          onClick={e => { e.stopPropagation(); setValue(v => v - step); }}
          aria-label="decrement"
        >
          –
        </button>
      </span>
    </span>
  );
}

const Button = (props: {pushed: boolean, color: ColorName, children: React.ReactNode, onClick?: () => void}) => (
  <div className='button-holder'>
    <button onClick={props.onClick}
      className={`button ${props.pushed ? 'pushed' : 'default'}`} style={noiseTexture(props.color, 4, 5)}>
      {props.children}</button>
  </div>
);


const RenderModel = () => <Component color={"red"} title={
  <>
    Render model
  </>
}>
  <Prop label="Select mesh"></Prop>
</Component>;
const PhysiscsColliderModel = () => {
  const [shape, setShape] = React.useState('box');
  const [inherit, setInherit] = React.useState(false);

  const toggleInherit = () => {
    setInherit((old) => !old);
  }

  return <Component color={"blue"} title={
  <>
    Physics collider ({shape}) <Toggle checked={inherit} onChange={toggleInherit}/>
  </>
}>
  <Prop label="Shape">
    <Button color="gray" onClick={() => {setShape('box');}} pushed={shape==='box'}>Box</Button>
    <Button color="gray" onClick={() => {setShape('sphere');}} pushed={shape==='sphere'}>Sphere</Button>
    <Button color="gray" onClick={() => {setShape('capsule');}} pushed={shape==='capsule'}>Capsule</Button>
  </Prop>
  <Prop label="Inherit from render model"><Toggle checked={inherit} onChange={toggleInherit}/></Prop>
  <Prop label="Size">
    <NumberEdit />
    <NumberEdit />
    <NumberEdit />
  </Prop>
</Component>;
}
const ShipOrientationModel = () => <Component color={"grape"} title={
  <>
    Ship Orientation
  </>
}>
  <Prop label="YPR">
    <NumberEdit />
    <NumberEdit />
    <NumberEdit />
  </Prop>
</Component>;

const EnablePhysicsSystem = () => <Component color={"pink"} title={
  <>
    Physiscs Simulation
  </>
}>
  This enabled the physics sim
</Component>
const ShipControl = () => <Component color={"teal"} title={
  <>
    ShipControl
  </>
}>
  Custom script to run ship controller update
</Component>

function App() {
  return (
    <>
      <div>
        <img src={euphoriaLogo} className="logo" alt="Euphoria logo" />
      </div>

      <Editor>
        <ComponentList>
          <RenderModel />
          <PhysiscsColliderModel />
          <ShipOrientationModel />
        </ComponentList>
        <SystemList>
          <EnablePhysicsSystem />
          <ShipControl />
        </SystemList>
      </Editor>
    </>
  )
}

export default App
