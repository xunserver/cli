import ejs from 'ejs'
import fs from 'fs'
import path from 'path'


export const renderAndOutput = async (source, dest, context) => {
    const result = await ejs.renderFile(source, context);
    fs.writeFileSync(path.resolve(process.cwd(), dest), result)
}