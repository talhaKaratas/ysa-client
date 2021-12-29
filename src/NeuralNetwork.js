const math = require('mathjs');

class NeuralNetwork {
  constructor(
    inputCount,
    hiddenLayerNodes,
    outputNodes,
    learningRate,
    wih,
    who
  ) {
    this.inputCount = inputCount;
    this.hiddenLayerNodes = hiddenLayerNodes;
    this.outputNodes = outputNodes;
    this.learningRate = learningRate;

    this.wih =
      wih ||
      math.subtract(
        math.matrix(math.random([this.hiddenLayerNodes, this.inputCount])),
        0.5
      );
    this.who =
      who ||
      math.subtract(
        math.matrix(math.random([this.outputNodes, this.hiddenLayerNodes])),
        0.5
      );

    // this.wih = math.matrix([
    //   [0.2, -0.1, 0.4],
    //   [0.7, -1.2, 1.2]
    // ]);

    // this.who = math.matrix([
    //   [1.1, 0.1],
    //   [3.1, 1.17]
    // ]);

    //Gecici
    // this.inputs = math.matrix([10, 30, 20]);
    // this.targets = math.matrix([1, 0]);
  }

  cache = { loss: [] };

  train(inputs, targets) {
    this.forward(inputs);
    this.bacward(targets);
    this.update();
  }

  forward(inputs) {
    const wih = this.wih;
    const who = this.who;
    const act = this.act;

    inputs = math.transpose(inputs);

    const h_in = math.multiply(wih, inputs);
    const h_out = act(h_in);

    const o_in = math.multiply(who, h_out);
    const actual = act(o_in);

    this.cache.inputs = inputs;
    this.cache.h_out = h_out;
    this.cache.actual = actual;

    return actual;
  }

  bacward(targets) {
    const who = this.who;
    const inputs = this.cache.inputs;
    const h_out = this.cache.h_out;
    const actual = this.cache.actual;

    const error = math.sum(
      math.evaluate('1/2 * (targets-actual) .* (targets-actual)', {
        targets,
        actual
      })
    );

    console.log(error);

    const dEdO = math.evaluate('(actual - targets)', { actual, targets });

    const dOdN = math.evaluate('actual .* (1-actual)', { actual });

    const dNdW = h_out;

    const dwho = math.multiply(
      math.dotMultiply(dEdO, dOdN).resize([dEdO.size()[0], 1]),
      math.transpose(dNdW.resize([dNdW.size()[0], 1]))
    );

    // const h_err = math.evaluate("who' * (dEdO .* dOdN)", {
    //   who,
    //   dEdO,
    //   dOdN
    // });

    const h_err = math.multiply(
      math.transpose(who),
      math.dotMultiply(dEdO, dOdN)
    );

    h_out.resize([h_out.size()[0]]);

    const h_dAdZ = math.evaluate('h_out .* (1 - h_out)', {
      h_out
    });

    const dwih = math.multiply(
      math.dotMultiply(h_err, h_dAdZ).resize([h_err.size()[0], 1]),
      math.transpose(inputs.resize([inputs.size()[0], 1]))
    );

    this.cache.dwih = dwih;
    this.cache.dwho = dwho;
    this.cache.loss.push(math.sum(math.sqrt(dEdO)));
  }

  update() {
    const wih = this.wih;
    const who = this.who;
    const dwih = this.cache.dwih;
    const dwho = this.cache.dwho;
    const learningRate = this.learningRate;

    this.wih = math.evaluate('wih - learningRate .* dwih', {
      wih,
      learningRate,
      dwih
    });

    this.who = math.evaluate('who - learningRate .* dwho', {
      who,
      learningRate,
      dwho
    });
  }

  act(matrix) {
    return matrix.map((x) => 1 / (1 + Math.exp(-x)));
  }

  normaliseData(data) {
    for (let index = 0; index < data[0].length; index++) {
      let min = data[0][index];
      let max = data[0][index];

      for (let i = 0; i < data.length; i++) {
        if (data[i][index] > max) max = data[i][index];
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i][index] < min) min = data[i][index];
      }

      for (let i = 0; i < data.length; i++) {
        data[i][index] = (data[i][index] - min) / (max - min);
      }
    }
  }
}

module.exports = NeuralNetwork;
