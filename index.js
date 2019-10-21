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
const _cloneDeep = require('lodash/cloneDeep');
const rep = /(?!^0\d+)^\d+$/;

function cloneDeep(obj1){
 return obj1 && typeof obj1 === "object" ? _cloneDeep(obj1):obj1;
}

function isString(value){
 return typeof value === "string";
}

function isNumber(value){
 return typeof value === "number";
}

function checkInt(value) {
 if(!isString(value))return null;
 let result = parseInt(value);
 return result.toString() == value ? result:null;
}

function arrayRemoveById(object,id) {
 if(Array.isArray(object))
   if(isNumber(id) && id>=0 && id< object.length)
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
 let initValue = function(key,id){
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
 walk(object,path1,function(key,index,path,object){
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
 let obj1 = get(object,targetPath);
 let obj2 = get(object,sourcePath);
 if(obj1 == undefined || obj2 == undefined)return false;
 set(object,sourcePath,obj1);
 set(object,targetPath,obj2);
 return true;
};

function fixPath(sourcePath,targetPath) {
  if(!isString(sourcePath) || !isString(targetPath))return targetPath;
  let sourceList = castPath(sourcePath);
  let targetList = castPath(targetPath);
  let fixed = false;
  let sl = sourceList.length;
  let tl = targetList.length;
  for (let i = 0; i < sl; i++) {
    if(i >= tl)return targetPath;
    let sid = sourceList[i],tid = targetList[i];
    if(tid === sid)continue;
    if(!(rep.test(tid) && rep.test(sid)))return targetPath;
    let sn = parseInt(sid,10);
    let tn = parseInt(tid,10);
    if(sn < tn && tl > sl){
      fixed = true;
      targetList[i] = tn - 1;
      break;
    }
  }

  return fixed ?targetList.map((v)=> rep.test(v)?`[${v}]`:v).join("") :
    targetPath;
}

function moveByPath(object,sourcePath,targetPath) {
  if(!isString(targetPath))return;
  if(targetPath === sourcePath)return;
  if(isString(sourcePath))targetPath = fixPath(sourcePath,targetPath);
  let obj1 = cloneDeep(isString(sourcePath)? get(object,sourcePath):sourcePath);
  if(isString(sourcePath))deleteByPath(object,sourcePath);
  walk(object,targetPath,true,function(key,index,path,item){
   if(index < path.length-1)return ;
   if(!Array.isArray(item)){
     item[key] = obj1;
     return;
   }
   let id =checkInt(key);
   if(!isNumber(id))return;
   if(id > item.length)
     for (var i = item.length; i < id; i++) {
       item.push(undefined);
     }
   item.splice(id,0,obj1);
 });
}

exports.moveByPath = moveByPath;
exports.deleteByPath = deleteByPath;