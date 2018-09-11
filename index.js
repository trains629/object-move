/**
 * 构建一个操作类，通过键值路径去添加删除对象，参照lodash的set或get函数去执行相应的操作。
 使用lodash中的一些函数，将path转换为数组，然后循环的去找到指定层级的对象没去做相应的
 操作。
 现在需要的几个操作：
 1. 删除指定位置的对象
 2. 在指定位置添加对象
 3. 将指定位置的对象移到指定位置
 */
 const set = require('lodash/set');
 const get = require('lodash/get');
 const castPath = require('lodash/_castPath');
 const toKey = require('lodash/_toKey');
 const cloneDeep = require('lodash/cloneDeep');

function checkInt(value) {
  if(typeof value !== "string")return null;
  let result = parseInt(value);
  return result.toString() == value ? result:null;
}

function arrayRemoveById(object,id) {
  if(Array.isArray(object))
    if(typeof id == "number" && id>=0 && id< object.length)
      object.splice(id,1);
}

function walk(object,path,insert,callBack) {
  if(typeof insert == "function"){
    callBack = insert;
    insert = false;
  }
  if(typeof callBack != "function")return ;
  path = castPath(path, object);
  var index = 0,length = path.length;
  let initValue = (key,id)=>{
    if(!insert)return ;
    let tkey = id <= length-1 ? toKey(path[id]):"";
    if(tkey && object[key] == undefined)
      object[key] = checkInt(tkey) == null ? {}:[];
  }
  while (object != null && index < length) {
    let key = toKey(path[index]);
    initValue(key,index+1);
    callBack(key,index,path,object);
    object = object[key];
    index++;
  }
}

function deleteByPath(object,path1) {
  let result;
  walk(object,path1,(key,index,path,object)=>{
    if(index < path.length-1)return ;
    result = cloneDeep(object[key]);
    if(Array.isArray(object))
      arrayRemoveById(object,checkInt(key));
    else
      delete object[key];
  });
  return result;
}

exports.swapByPath = function (object,sourcePath,targetPath) {
  let tpath1 = castPath(targetPath, object);
  let tpath2 = castPath(sourcePath, object);
  // 需要对数据进行备份
  let obj1 = get(object,targetPath);
  let obj2 = get(object,sourcePath);
  if(obj1 == undefined || obj2 == undefined)return false;
  set(object,sourcePath,obj1);
  set(object,targetPath,obj2);
  return true;
};

exports.moveByPath = function (object,sourcePath,targetPath) {
  let obj1 = typeof sourcePath == "string" ? get(object,sourcePath):sourcePath;
  if(typeof sourcePath == "string"){
    deleteByPath(object,sourcePath);
  }
  walk(object,targetPath,true,(key,index,path,object)=>{
    if(index < path.length-1)return ;
    if(Array.isArray(object)){//为数组就插入进去
      let id =checkInt(key);
      if(typeof id == "number"){
        if(id > object.length){
          for (var i = object.length; i < id; i++) {
            object.push(undefined);
          }
        }
        object.splice(id,0,obj1);
      }
      return ;
    }
    object[key] = obj1;
  });

};

exports.deleteByPath = deleteByPath;
