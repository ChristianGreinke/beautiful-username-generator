const {readdir,stat,unlink,readFile,writeFile } = require('node:fs/promises');

const path = require('path');

(async ()=>{

    try {
    
        const files = await readdir('./api' );

      
        for( const file of files ) {
       
            const fPath = path.join( './api', file );

            const fStat = await stat( fPath );

            if( fStat.isFile() && file.indexOf('flattenedFlowers')>=0) await unlink(fPath);
           

        } 
    }
    catch( e ) {
   
        console.error( "We've thrown! Whoops!", e );
    }

    function camelize(str) {
        return str.split(' ').map(w=>w.charAt(0).toUpperCase()+w.substring(1)).join('');
    }

    const flowersJson = JSON.parse(await readFile( './raw/flowers.json'));

    const flowers = Object.keys(flowersJson).map((k)=>flowersJson[k]).map(camelize);

    const maxLength = flowers.reduce((a,c)=>c.length>a?c.length:a,0);

    const enc = new TextEncoder();

    const writes = flowers.map(async (f)=>{
        const ab = new ArrayBuffer(maxLength);
        const uinArray = new Uint8Array(ab);
        enc.encodeInto(f,uinArray);

        await writeFile(`./api/flattenedFlowers_${maxLength}.bin`,Buffer.from(ab),{ flag: 'a+' });
    });

    await Promise.all(writes);

})();