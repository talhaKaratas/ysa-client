import React from 'react';
import { useHistory } from 'react-router-dom';

const App = () => {
  const history = useHistory();

  return (
    <div className="homeContainer">
      <div
        className="homeBox"
        onClick={() => {
          history.push('/learn');
        }}
      >
        Veri seti ile öğren
      </div>
      <div
        className="homeBox"
        onClick={() => {
          history.push('/test');
        }}
      >
        Veri seti ile test et
      </div>
    </div>
  );
};

export default App;
