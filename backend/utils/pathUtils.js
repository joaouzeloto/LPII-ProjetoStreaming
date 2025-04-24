import path from 'path';

const pathAbsolute = new URL('.',import.meta.url).pathname;
let __dirname = path.dirname(pathAbsolute).slice(1);
__dirname = decodeURIComponent(__dirname);
export default __dirname;