import { Ripple } from './ripple/Ripple'

function App() {
  return (
    <div style={{padding:12,display:'flex',gap:12}}>
      <div>
        <Ripple
          style={{padding:'4px 8px',fontSize:12,color:'white',backgroundColor:'#F54A45'}}
          focusRipple
          as='a'
          href='https://baidu.com'
          target='_blank'
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          style={{padding:'8px 12px',fontSize:14,color:'white',backgroundColor:'#0B58D2'}}
          focusRipple
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          style={{padding:'12px 18px',fontSize:16,color:'white',backgroundColor:'#058373'}}
          focusRipple
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          style={{padding:'12px 24px',fontSize:22,fontWeight:500,color:'white',backgroundColor:'#FF9900'}}
          focusRipple
        >
          按钮
        </Ripple>
      </div>
    </div>
  )
}

export default App
