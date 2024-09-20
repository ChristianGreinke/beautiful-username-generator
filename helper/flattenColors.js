const {readdir,stat,unlink,readFile,writeFile } = require('node:fs/promises');

const path = require('path');

(async ()=>{

    try {
    
        const files = await readdir( './api');

      
        for( const file of files ) {
       
            const fPath = path.join( './api', file );

            const fStat = await stat( fPath );

            if( fStat.isFile() && file.indexOf('flattenedColors')>=0) await unlink(fPath);
           

        } 
    }
    catch( e ) {
   
        console.error( "We've thrown! Whoops!", e );
    }

    function camelize(str) {
        return str.split(' ').map(w=>w.charAt(0).toUpperCase()+w.substring(1)).join('');
    }

    const attributes = (await readFile('./raw/colors.csv')).toString().split('\n').map(camelize);


    const maxLength = attributes.reduce((a,c)=>c.length>a?c.length:a,0);

    const enc = new TextEncoder();

    const writes = attributes.map(async (f)=>{
        const ab = new ArrayBuffer(maxLength);
        const uinArray = new Uint8Array(ab);
        enc.encodeInto(f,uinArray);

        await writeFile(`./api/flattenedColors_${maxLength}.bin`,Buffer.from(ab),{ flag: 'a+' });
    });

    await Promise.all(writes);

})();