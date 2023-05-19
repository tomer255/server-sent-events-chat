"use strict";

var cons = {};

function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}

const idGen = idGenerator();

const writeALlCons = (obj) => {
  const data = JSON.stringify(obj);
  for (const [id, con] of Object.entries(cons)) {
    sendCon(con, data);
  }
};

const sendConObj = (con, obj) => {
  const data = JSON.stringify(obj);
  sendCon(con, data);
};

const sendCon = (con, data) => con.write(`data: ${data}\n\n`);

module.exports.sendAll = (req, res) => {
  const { message, sender } = req.body;
  const obj = { event: "message", data: { sender, message } };
  writeALlCons(obj);
  return res.status(200).send("send");
};

module.exports.connect = (req, res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  // Tell the client to retry every 10 seconds if connectivity is lost
  res.write("retry: 10000\n\n");
  const id = idGen.next().value;
  sendConObj(res, { event: "connect", data: { id } });
  writeALlCons({
    event: "message",
    data: { sender: " System", message: `new connection : ${id}` },
  });

  cons[id] = res;
};

module.exports.disconnect = (req, res) => {
  const { id } = req.body;
  delete cons[id];
  writeALlCons({
    event: "message",
    data: { sender: " System", message: `disconnect: ${id}` },
  });
  return res.status(200).end();
};
