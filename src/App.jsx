import { Ripple } from './ripple/Ripple'

function App() {
  return (
    <Ripple
      style={{padding:20,color:'red',backgroundColor:'white'}}
      focusRipple
    >
      按钮
    </Ripple>
  )
}

export default App
