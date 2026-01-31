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
  </div>;
}

const EditorBody = (props: {children: React.ReactNode, fractions: number[]}) => {
  // given
  // [1, 1] => grid-template-columns: auto 1fr auto 1fr auto;
  // [1, 1, 1] =>  grid-template-columns: auto 1fr auto 1fr auto 1fr auto;
  const s = props.fractions.reduce((x,c) => x + `auto ${c}fr `, '') + 'auto';
  return <div className='editor-body' style={{
    gridTemplateColumns: s
  }}>
    {props.children}
    {
      /* create a array of fractions + 1 size and make all the borders from it */
      [...Array(props.fractions.length + 1).keys()].map(x => <Border key={x} col={x}/>)
    }
  </div>;
}

const TitleBar = (props: React.PropsWithChildren) => {
  return <div className='title-bar'>
    {props.children}
  </div>;
}

const TabBar = (props: React.PropsWithChildren) => {
  return <div className='tab-bar'>
    {props.children}
  </div>;
}

const Border = (props: {col: number}) => {
  const col = props.col * 2 + 1;
  return <div className='border' style={{
    gridColumnStart: col,
    gridColumnEnd: col+1
  }}/>;
}

const List = (props: {children: React.ReactNode, col: number}) => {
  const col = 2 + 2*props.col;
  return <div className='list' style={{
    gridColumnStart: col,
    gridColumnEnd: col+1
  }}>
    {props.children}
  </div>;
}

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
  return (
    <span className="led-number-edit">
      <span className="led-display">
        <input
          ref={inputWidget}
          type="text"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="led-input"
          onSelect={() => {
            if(inputWidget.current) {
              inputWidget.current.select();
            }
          }}
        />
      </span>
    </span>
  );
}


const FileBrowser = () => {
  const value = "~/assets/file.ext";
  return (
    <span className="led-number-edit">
      <span className="led-display">
        {value}
        <button
          className="led-stepper led-stepper-inc"
          type="button"
          aria-label="browse file"
        >
          ...
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
    Mesh
  </>
}>
  <Prop label='File'>
      <FileBrowser />
    </Prop>
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

type TabName = "world" | "entity" | "particles";

const EdTab = (props: {name: TabName, tab: TabName, setTab: (t: TabName) => void}) => {
  const sel = props.name === props.tab;
  const bg: ColorName = sel ? "yellow" : "gray";
  return <button className={`tab ${sel ? 'selected' : 'not-selected'}`} onClick={() => props.setTab(props.name)} style={{
    backgroundColor: colors[bg][4]
  }}>{props.name}</button>
}


function App() {
  const [tab, setTab] = React.useState<TabName>("entity");
  return (
    <>
      <Editor>
        <TitleBar>
          <img src={euphoriaLogo} className="logo" alt="Euphoria logo" />
          Euphoria editor
        </TitleBar>
        <TabBar>
          <EdTab tab={tab} setTab={setTab} name='world' />
          <EdTab tab={tab} setTab={setTab} name='entity' />
          <EdTab tab={tab} setTab={setTab} name='particles' />
        </TabBar>
        <EditorBody fractions={[1, 1]}>
          <List col={0}>
            <RenderModel />
            <PhysiscsColliderModel />
            <ShipOrientationModel />
          </List>
          <List col={1}>
            <EnablePhysicsSystem />
            <ShipControl />
          </List>
        </EditorBody>
      </Editor>
    </>
  )
}

export default App
