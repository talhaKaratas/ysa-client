import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from '../axios';
import Table from '../components/Table';
import NeuralNetwork from '../NeuralNetwork';
const math = require('mathjs');

const Learn = () => {
  const [hiddenLayerNodes, setHiddenLayerNodes] = useState(1);
  const [outputNodes, setOutputNodes] = useState(1);
  const [learningRate, setLearningRate] = useState(0.5);
  const [epochCount, setEpochCount] = useState(10);

  const [completedEpochCount, setCompletedEpochCount] = useState(0);

  const [dataset, setDataset] = useState([]);

  const fileInputRef = useRef();

  const [data, setData] = useState([]);
  const [label, setLabel] = useState([]);
  const [target, setTarget] = useState([]);

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

  useEffect(() => {
    setNn(
      () =>
        new NeuralNetwork(
          label.length - 1,
          Number(hiddenLayerNodes),
          Number(outputNodes),
          learningRate
        )
    );
  }, [label, learningRate, outputNodes, hiddenLayerNodes, dataset]);

  if (data.length) {
    nn.normaliseData(data);
  }

  // console.log(nn.wih, nn.who);

  useEffect(() => {
    (async () => {
      if (completedEpochCount !== 0 && completedEpochCount <= epochCount - 1) {
        startLearning();
      }
      if (completedEpochCount >= epochCount) {
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<', completedEpochCount);
        const wih = nn.wih;
        const who = nn.who;

        try {
          const res = await axios.post('/learn', {
            hiddenLayerNodes,
            outputNodes,
            learningRate,
            wih,
            who
          });
          console.log(res.data);
        } catch (err) {
          console.log('err');
        }
      }
    })();
  }, [completedEpochCount]);

  const startLearning = async () => {
    for (let index = 0; index < data.length; index++) {
      nn.train(math.matrix(data[index]), math.matrix([target[index]]));
    }
    setCompletedEpochCount((curr) => curr + 1);
  };

  return (
    <div>
      <Table
        dataset={dataset}
        fileInputRef={fileInputRef}
        setDataset={setDataset}
      />
      <div className="content">
        <div className="formWrapper">
          <div className="inputs">
            <div className="inputWrapper">
              <label htmlFor="hiddenLayerNodes">
                Gizli Katman Nöron Sayısı
              </label>
              <input
                id="hiddenLayerNodes"
                name="hiddenLayerNodes"
                onChange={(e) => setHiddenLayerNodes(e.target.value)}
                value={hiddenLayerNodes}
                type={'number'}
                min={1}
              />
            </div>
            <div className="inputWrapper">
              <label htmlFor="outputNodes">Çıkış Nöron Sayısı</label>
              <input
                id="outputNodes"
                name="outputNodes"
                onChange={(e) => setOutputNodes(e.target.value)}
                value={outputNodes}
                type={'number'}
                min={1}
              />
            </div>
            <div className="inputWrapper">
              <label htmlFor="learningRate">Öğrenme Katsayısı</label>
              <input
                id="learningRate"
                name="learningRate"
                onChange={(e) => setLearningRate(e.target.value)}
                value={learningRate}
                type={'number'}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
            <div className="inputWrapper">
              <label htmlFor="epochCount">Epoch Sayısı</label>
              <input
                id="epochCount"
                name="epochCount"
                onChange={(e) => setEpochCount(e.target.value)}
                value={epochCount}
                type={'number'}
              />
            </div>
          </div>

          <button
            className="startButton"
            disabled={!dataset.length}
            onClick={startLearning}
          >
            Başla
          </button>
        </div>
        <p id="counter">Epoch sayısı: {completedEpochCount}</p>
      </div>
    </div>
  );
};

export default Learn;
