import { useReducer } from 'react';
import './App.css';
import DegitButton from './DegitButton';
import OperateDegitButton from './OperateDegitButton'
export const ACTIONS = {
  ADD_DIGIT: 'add-ditgit',
  CHOOSE_OPERATION : "choose-operation",
  CLEAR:'clear',
  DELETE_DIGIT:'delete-digit',
  EVALUATE:'evaluate'
}
const FormatNumObj = new Intl.NumberFormat('en-us',{
  maximumFractionDigits:0,
})
function format(operand){
  if(operand==null) return
  const [ interger , decimal] = operand.split('.')
  if(decimal == null ) return FormatNumObj.format(operand)
  return `${FormatNumObj.format(operand)}.${decimal}`
}

function reducer(state,{type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentOperand:`${payload.digit}`,
          overwrite:false,
        }
      }
      if(payload.digit ==="0" &&state.currentOperand ==="0") return state;
      if(payload.digit ==="." && state.currentOperand&&state.currentOperand.includes(".") ) return state;
      return{
        ...state, 
        currentOperand:`${state.currentOperand||""}${payload.digit}`,
      }
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperand==null && state.previousOperand==null){
          return state;
        }
        if(state.previousOperand==null){
          return{
            ...state,
            operation: payload.operation,
            previousOperand:state.currentOperand,
            currentOperand:null,
          }
        }
        if(state.currentOperand==null){
          return {
            ...state,
            operation:payload.operation,
          }
        }
        return{
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand:null,
        }
      case ACTIONS.CLEAR:
        return {}
      case ACTIONS.EVALUATE:
        if (state.operation==null|| state.currentOperand==null||state.previousOperand==null){
            return state;
        }
        return {
          ...state,
          overwrite:true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        } 
          case ACTIONS.DELETE_DIGIT:
            if (state.overwrite){
              return {
                ...state,
                overwrite:false,
                currentOperand:null
              }
            }
            if(state.currentOperand
              ==null) return state
            if(state.currentOperand.length===1) return {
              ...state,currentOperand:null
            }
            return {
              ...state,
              currentOperand:state.currentOperand.slice(0,-1)
            }
  }
  return state;
}
function evaluate({currentOperand,previousOperand,operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if ( isNaN(prev)||isNaN(current)) return ''
  let computation='';
  switch (operation){
    case '+':
      computation= prev+current
      break
    case '-':
      computation = prev-current;
      break;
    case '*':
      computation = prev * current;
      break;

  case '/':
      computation =prev / current;
      break;


  }
  return computation.toString()
}
function App() {
  const [ {currentOperand, previousOperand, operation}, dispatch ]=useReducer(reducer, {})

  return <div className='caculator-grid'>
    <div className='output'>
      <div className="previous-operand">
        {format(previousOperand)} {operation}
      </div>
      <div className="current-operand">{format(currentOperand)}</div>
    </div>
      <button className="span-two" onClick={()=>{
        dispatch({type:ACTIONS.CLEAR})
      }}>AC</button>
      <button onClick={()=>{
        dispatch({type:ACTIONS.DELETE_DIGIT})
      }}>DEL</button>
     <OperateDegitButton operation="/" dispatch={dispatch}/>
     <DegitButton digit="1" dispatch={dispatch}/>
     <DegitButton digit="2" dispatch={dispatch}/>
     <DegitButton digit="3" dispatch={dispatch}/>
     <OperateDegitButton operation="*" dispatch={dispatch}/>
     <DegitButton digit="4" dispatch={dispatch}/>
     <DegitButton digit="5" dispatch={dispatch}/>
     <DegitButton digit="6" dispatch={dispatch}/>
     <OperateDegitButton operation="+" dispatch={dispatch}/>
     <DegitButton digit="7" dispatch={dispatch}/>
     <DegitButton digit="8" dispatch={dispatch}/>
     <DegitButton digit="9" dispatch={dispatch}/>
     <OperateDegitButton operation="-" dispatch={dispatch}/>
     <DegitButton digit="." dispatch={dispatch}/>
     <DegitButton digit="0" dispatch={dispatch}/>

     
      <button className="span-two" onClick={()=>{
        dispatch({type:ACTIONS.EVALUATE})
      }}>=</button>
  </div>
}

export default App;
