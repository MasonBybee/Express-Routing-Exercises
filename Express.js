const express = require("express");
const ExpressError = require("./expressError");

const app = express();

app.use(express.json());

function checkArrThrowError(arr) {
  if (!arr.every((v) => Number(v))) {
    throw new ExpressError("Invalid number passed", 400);
  }
}

function mean(arr) {
  checkArrThrowError(arr);
  return arr.reduce((psum, a) => psum + a, 0) / arr.length;
}

function median(arr) {
  checkArrThrowError(arr);
  return arr.length % 2 === 0
    ? [arr[arr.length / 2] + arr[arr.length / 2 - 1]] / 2
    : arr[(arr.length - 1) / 2];
}

function mode(arr) {
  checkArrThrowError(arr);
  return arr
    .sort((first, second) => {
      return (
        arr.filter((val) => val === first).length -
        arr.filter((val) => val === second).length
      );
    })
    .pop();
}

app.get("/mean", (req, res, next) => {
  try {
    if (!req.query.nums) {
      throw new ExpressError("Bad Request", 400);
    }
    const arr = req.query.nums.split(",").map(Number);
    const meanNum = mean(arr);
    const response = { operation: "mean", value: meanNum };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
});

app.get("/median", (req, res, next) => {
  try {
    if (!req.query.nums) {
      throw new ExpressError("Bad Request", 400);
    }
    const arr = req.query.nums.split(",").map(Number);
    const medianNum = median(arr);
    const response = { operation: "median", value: medianNum };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
});

app.get("/mode", (req, res, next) => {
  try {
    if (!req.query.nums) {
      throw new ExpressError("Bad Request", 400);
    }
    const arr = req.query.nums.split(",").map(Number);
    const modeNum = mode(arr);
    const response = { operation: "mode", value: modeNum };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
});
app.get("/all", (req, res, next) => {
  try {
    if (!req.query.nums) {
      throw new ExpressError("Bad Request", 400);
    }
    const arr = req.query.nums.split(",").map(Number);
    const modeNum = mode(arr);
    const medianNum = median(arr);
    const meanNum = mean(arr);
    const response = {
      operation: "all",
      mean: meanNum,
      median: medianNum,
      mode: modeNum,
    };
    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
});

app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.msg;

  return res.status(status).json({ error: { message, status } });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
