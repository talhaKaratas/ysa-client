import React, { useState, useRef, useEffect } from 'react';
import Table from '../components/Table';
import axios from '../axios';
import NeuralNetwork from '../NeuralNetwork';
const math = require('mathjs');

const Test = () => {
  const [result, setResult] = useState([]);
  const [dataset, setDataset] = useState([]);

  const fileInputRef = useRef();

  const [data, setData] = useState([]);
  const [label, setLabel] = useState([]);
  const [target, setTarget] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const newSet = dataset.map((arr) => arr.slice());
    if (newSet.length) {
      const newData = newSet.filter((item, index) => index !== 0);
      setData(newData);
      setLabel(newSet.filter((item, index) => index === 0)[0]);
      setTarget(newData.map((item) => item.pop()));
    }
  }, [dataset]);

  const [nn, setNn] = useState(() => new NeuralNetwork());

  useState(() => {
    (async () => {
      try {
        const res = await axios.get('/test');

        console.log('>>>>');

        const nn = setNn(
          () =>
            new NeuralNetwork(
              label.length - 1,
              res.data.hiddenLayerNodes,
              res.data.outputNodes,
              res.data.learningRate,
              res.data.wih.data,
              res.data.who.data
            )
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [label, data]);

  if (data.length) {
    nn.normaliseData(data);
  }

  useEffect(() => {
    if (count !== 0 && count <= data.length - 1) {
      handleClick(count);
    }
    if (count >= data.length) return;
  }, [count]);

  const handleClick = async (index = 0) => {
    console.log(data[index]);
    nn.forward(math.matrix(data[index]));
    console.log(nn.cache.actual._data);
    setResult([...result, nn.cache.actual._data]);
    setCount((curr) => curr + 1);
  };

  return (
    <div>
      <Table
        dataset={dataset}
        fileInputRef={fileInputRef}
        setDataset={setDataset}
        testTable
        testedRow={count}
        result={result}
      />
      <button
        className="startButton"
        onClick={() => handleClick()}
        disabled={!dataset.length}
      >
        Test et
      </button>
    </div>
  );
};

export default Test;
