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

test('t1.t3 move t7[0]', () => {
  moveByPath(t3,"t1.t3","t7[0]");
  expect(t3["t1"]["t3"]).toBeUndefined();
});

test("t7[2] move to t1.t3.t8[1]",()=>{
  let path = "t1.t3.t8[1]";
  moveByPath(t3,"t7[2]",path);
  expect(_get(t3,path)).toBe(2);
});

test("t2.t5[0] swap t7[0]t4",()=>{
  swapByPath(t3,"t2.t5[0]","t7[0]t4");
  expect(_get(t3,"t2.t5[0]")).toBe("hello");
});

test("delete t7[3]",()=>{
  let val1 = deleteByPath(t3,"t7[3]");
  expect(t3["t7"][3]).toBeUndefined();
  expect(val1).toBe(4);
})

test("move back",()=>{
  let list = [1,2,3,4,5,6]
  let id1 = 2;
  let id2 = 4
  let value = list[id1]
  moveByPath(list,`[${id1}]`,`[${id2}]`)
  expect(list[id2]).toBe(value)
})

test("move front",()=>{
  let list = [1,2,3,4,5,6]
  let id1 = 4;
  let id2 = 0
  let value = list[id1]
  moveByPath(list,`[${id1}]`,`[${id2}]`)
  expect(list[id2]).toBe(value)
})

test("move object",()=>{
  let list = [
    {
      "hello" : "word"
    },
    {
      "list" :[
        2,3
      ]
    }
  ]
  let id1 = 0;
  let id2 = 1;
  let value = {...list[id1]};
  moveByPath(list,`[${id1}]`,`[${id2}]list[1]`)
  expect(list[id1]["list"][1]["hello"]).toBe(value["hello"])
})
