const {deleteByPath,swapByPath,moveByPath} = require('./');
const _get = require('lodash/get');

let t3 = {
  "t1":{
    "t3":{
      "t4":"hello",
      t8:[{
        t9:"121"
      },
      12]
    }
  },
  "t2":{
    "t5":[
      {
        "t6":"world",
      },
      123
    ]
  },
  "t7":[
    1,2,3,4
  ]
}


function log(obj) {
  console.log(JSON.stringify(obj,null,2));
}

test('t1.t3 move t7[0]', () => {
  moveByPath(t3,"t1.t3","t7[0]");
  log(t3);
  expect(t3["t1"]["t3"]).toBeUndefined();
});

test("t7[2] move to t1.t3.t8[1]",()=>{
  let path = "t1.t3.t8[1]";
  moveByPath(t3,"t7[2]",path);
  log(t3);
  expect(_get(t3,path)).toBe(2);
});

test("t2.t5[0] swap t7[0]t4",()=>{
  swapByPath(t3,"t2.t5[0]","t7[0]t4");
  log(t3);
  expect(_get(t3,"t2.t5[0]")).toBe("hello");
});
