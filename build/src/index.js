"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets = require("./assets/assets");
const console = require('./console');
const mysql = require('mysql2');
const { crc16 } = require('crc');
const envconf = require('dotenv').config();
const cron = require('node-cron');
const nunjucks = require('nunjucks');
const path = require('path');
const format = require('date-fns/format');
const WEBSITE_ROOT_PATH = process.env.WEBSITE_ROOT_PATH;
const PERSON_PATH = process.env.PERSON_PATH;
const person = process.env.PERSON;
const Categories = [
    { langDB: 'uk-UA', category: [103], datefnLocale: 'uk', pn: 0 },
    {
        langDB: 'ru-RU',
        category: [87, 88, 89, 90, 87, 87, 88],
        datefnLocale: 'ru',
        pn: 0,
    },
    { langDB: 'en-GB', category: [95], datefnLocale: 'en-GB', pn: 0 },
];
if (envconf.error) {
    throw envconf.error;
} // ERROR if Config .env file is missing
const connectionRECIPE = mysql
    .createConnection({
    host: process.env.DB_RECIPEHOST,
    port: process.env.DB_RECIPEPORT,
    user: process.env.DB_RECIPEUSER,
    database: process.env.DB_RECIPEDATABASE,
    password: process.env.DB_RECIPEPASSWORD,
})
    .promise();
const connectionPRESS = mysql
    .createConnection({
    host: process.env.DB_PRESSHOST,
    port: process.env.DB_PRESSPORT,
    user: process.env.DB_PRESSUSER,
    database: process.env.DB_PRESSDATABASE,
    password: process.env.DB_PRESSPASSWORD,
})
    .promise();
nunjucks.configure(process.env.PATH_TEMPLATES, { autoescape: true });
const main = async () => {
    try {
        const personArr = person ? person.split('|') : ['bolie'];
        const now = new Date(); // Now
        const aliasUniq = '-' + crc16(now.toString()).toString(16);
        for (let ic = 0, icat; (icat = Categories[ic]); ++ic) {
            if (icat.langDB !== 'ru-RU')
                continue;
            const lang_DB = icat.langDB;
            const category = assets.sortRandom(icat.category)[0];
            const lang = lang_DB.split('-')[0];
            const Locale = require('date-fns/locale/' + icat.datefnLocale);
            const pesonRand = assets.sortRandom(personArr)[0];
            const PersonImgPath = path.resolve(PERSON_PATH, pesonRand);
            let PostImgSrc = await assets.getRandomImage(PersonImgPath);
            const WRT = path.resolve(WEBSITE_ROOT_PATH);
            PostImgSrc = PostImgSrc.replace(WRT, '');
            let sql = 'SELECT * FROM edaru ORDER BY RAND() LIMIT 1 ';
            const result = await connectionRECIPE.query(sql);
            if (result[0].length === 0)
                return 'NO RECIPE DATA';
            const rcp = result[0][0];
            rcp.ingredients = JSON.parse(rcp.ingredients);
            rcp.instructions = JSON.parse(rcp.recipeInstructions);
            rcp.nutrition = JSON.parse(rcp.nutrition);
            console.log(rcp);
            const pn = assets.getRandomIntInclusive(0, icat.pn);
            const dateLoc = format(now, 'do MMMM yyyy', { locale: Locale });
            const dateLoc2 = format(now, 'd MMMM yyyy', { locale: Locale });
            const PostTitle = nunjucks.render(`post-title.${pn}.${lang}.njk`, {
                dateLoc: dateLoc,
                rcp,
            });
            const alias = assets.aliasSlug(PostTitle) + aliasUniq;
            const PostText = nunjucks.render(`post-text.${pn}.${lang}.njk`, {
                imgsrc: PostImgSrc,
                dateloc: dateLoc,
                dateloc2: dateLoc2,
                rcp,
            });
            //console.log(PostTitle);
            //console.log(PostText);
            sql =
                'INSERT INTO os0fr_content (title, alias, introtext, catid, language, state, created, publish_up, created_by,access) VALUES (?,?,?,?,?,1,NOW(),NOW(),84,1)';
            const post = [PostTitle, alias, PostText, category, lang_DB];
            await connectionPRESS.query(sql, post);
        } // End For
        return 'Successful';
    }
    catch (err) {
        console.log(err);
        return err.message;
    }
};
if (process.env.CRON) {
    cron.schedule(process.env.CRON, () => {
        main()
            .then()
            .catch(err => console.error(err));
    }, { scheduled: true });
}
else {
    main()
        .then(created => console.log(created))
        .catch(err => console.error(err));
}
//# sourceMappingURL=index.js.map