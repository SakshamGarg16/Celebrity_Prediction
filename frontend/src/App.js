import './App.css';
import React from 'react';
import {useSpring,animated} from 'react-spring';

import Celb from './celb';

export default function App() {
  
  return(
    <div className="App">
        
      <div data-aos="fade-in">
      
        <Celb />
        
      </div>
      
    </div>
  )
}