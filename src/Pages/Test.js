import React, { useState, useRef, useEffect } from 'react';
import Table from '../components/Table';
import axios from '../axios';
import NeuralNetwork from '../NeuralNetwork';
const math = require('mathjs');

const Test = () => {
  const [testedRow, setTestedRow] = useState(0);
  const [result, setResult] = useState([]);
  const [dataset, setDataset] = useState([]);

  const fileInputRef = useRef();

  const handleClick = async () => {
    let learningSet = [...dataset];

    const data = learningSet.splice(1, learningSet.length - 1);
    const label = learningSet.splice(0, 1)[0];
    let target = [];
    for (let index = 0; index < data.length; index++) {
      target.push(data[index].pop());
    }
    try {
      const res = await axios.get('/test');

      const nn = new NeuralNetwork(
        label.length - 1,
        res.data.hiddenLayerNodes,
        res.data.outputNodes,
        res.data.learningRate,
        res.data.wih.data,
        res.data.who.data
      );

      nn.normaliseData(data);
      for (let index = 0; index < data.length; index++) {
        nn.forward(math.matrix(data[index]));
        console.log(nn.cache.actual);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Table
        dataset={dataset}
        fileInputRef={fileInputRef}
        setDataset={setDataset}
        testTable
        testedRow={testedRow}
        result={result}
      />
      <button
        className="startButton"
        onClick={handleClick}
        disabled={!dataset.length}
      >
        Test et
      </button>
    </div>
  );
};

export default Test;
