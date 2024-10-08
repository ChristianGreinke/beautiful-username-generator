const path = require('path');
const {readdir,stat,read,open } = require('node:fs/promises');
const [atbSize,colSize,flwSize]=[15,15,22];
const [atbFSize,colFSize,flwFSize]=[0xC30,0xCD5,0x228C];
const { Buffer } = require('node:buffer');

const generateUsername = async ()=>{
   const atbLength=atbFSize/atbSize;
   const colLength=colFSize/colSize;
   const flwLength=flwFSize/flwSize;

   const atbRndIndex = Math.floor(Math.random() * atbLength);
   const colRndIndex = Math.floor(Math.random() * colLength);
   const flwRndIndex = Math.floor(Math.random() * flwLength);

   const atbArray = new Buffer.alloc(atbSize);
   const colArray = new Buffer.alloc(colSize);
   const flwArray = new Buffer.alloc(flwSize);

   const dec = new TextDecoder();

   let foHandle ;
   try{
      foHandle= await open(__dirname +`/flattenedAttributes_${atbSize}.bin`);

      await foHandle.read(atbArray, 0, atbSize, atbRndIndex*atbSize);
   }finally{
      await foHandle?.close();
   }
   try{
      foHandle= await open(__dirname +`/flattenedColors_${colSize}.bin`);

      await foHandle.read(colArray, 0, colSize, colRndIndex*colSize);
   }finally{
      await foHandle?.close();
   }
   try{
      foHandle= await open(__dirname +`/flattenedFlowers_${flwSize}.bin`);

      await foHandle.read(flwArray, 0, flwSize, flwRndIndex*flwSize);
   }finally{
      await foHandle?.close();
   }
   
   let result ='';

   for(const v of atbArray){
      if(v===0) break;
      result+=String.fromCharCode(v);
   }

   for(const v of colArray){
      if(v===0) break;
      result+=String.fromCharCode(v);
   }

   for(const v of flwArray){
      if(v===0) break;
      result+=String.fromCharCode(v);
   }
   // const atbValue = atbArray.reduce.toString('utf-8');
   // const colValue = colArray.toString('utf-8');
   // const flwValue = flwArray.toString('utf-8');

   
   return result;
}

module.exports.gen = async (options={}) => {
   
   options.maxLength = options.maxLength || (atbSize+colSize+flwSize);
   options.maxTries = options.maxTries || 1000;

   let username;
   let genCounter=0;
   while(!username || (username.length>options.maxLength && genCounter< options.maxTries)){
      username=await generateUsername();
      genCounter++;
   }

   return username;
  }
