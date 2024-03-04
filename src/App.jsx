import { Ripple } from './ripple/Ripple'

function App() {
  return <>
    <div style={{padding:12,display:'flex',flexDirection:'column',gap:12}}>
      <div>
        <Ripple
          sx={{padding:'4px 8px',fontSize:12,color:'white',backgroundColor:'#F54A45'}}
          focusRipple
          as='a'
          target='_blank'
          href='https://github.com'
          title='kale'
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          sx={{padding:'8px 12px',fontSize:14,color:'white',backgroundColor:'#0B58D2'}}
          focusRipple
          autoFocus
          disabled
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          sx={{padding:'6px 16px',width:'100%',borderRadius:'4px',fontSize:14,fontWeight:500,color:'white',backgroundColor:'#058373'}}
          focusRipple
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          centerRipple
          focusRipple
          sx={{padding:'24px',fontSize:22,fontWeight:500,color:'black',backgroundColor:'#FF9900'}}
        >
        </Ripple>
      </div>
      <div>
        <Ripple title='???' children='gogo' className='gogo' sx={{color:'#1976D2',padding:10}} />
      </div>
    </div>
  </>
}

export default App
