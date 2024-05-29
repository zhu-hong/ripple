import { useRef } from 'react'
import { Ripple } from './ripple/Ripple'
import { useEffect } from 'react'

function App() {
  const ref = useRef(null)

  useEffect(() => {
    console.log(ref.current)
  }, [])

  return <>
    <div style={{padding:12,display:'flex',flexDirection:'column',gap:12}}>
      <div>
        <Ripple
          style={{padding:'4px 8px',fontSize:12,color:'white',backgroundColor:'#F54A45'}}
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
          style={{padding:'8px 12px',fontSize:14,color:'white',backgroundColor:'#0B58D2'}}
          focusRipple
          autoFocus
          ref={ref}
          onFocus={() => console.log('focus')}
          onFocusVisible={() => console.log('focusvisible')}
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          style={{padding:'6px 16px',width:'100%',borderRadius:'4px',fontSize:14,fontWeight:500,color:'white',backgroundColor:'#058373'}}
          focusRipple
          disabled
          onClick={console.log}
          onKeyDown={console.log}
        >
          按钮
        </Ripple>
      </div>
      <div>
        <Ripple
          centerRipple
          focusRipple
          style={{padding:'24px',fontSize:22,fontWeight:500,color:'black',backgroundColor:'transparent'}}
          onClick={console.log}
        >
        </Ripple>
      </div>
      <div>
        <Ripple focusRipple title='???' children='gogo' className='gogo' style={{color:'#1976D2',padding:10}} />
      </div>
    </div>
  </>
}

export default App
