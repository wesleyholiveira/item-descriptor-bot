import { BANANA } from "../../../index.mjs";

const LANGS = ["pt-br", "en", "ru"];

export default (name, args) => {
	let langRet = {
        code: 99,
	    msg: `A seguinte linguagem está definida: ${BANANA.lang}`
    }
    
    if (args.length > 0) {
        langRet.msg = "Nenhuma linguagem correspondente foi encontrada.";
        const lang = args[0].toLowerCase();
        if (LANGS.includes(lang)) {
            BANANA.lang = lang;
            langRet.msg = `A nova linguagem definida é: ${lang}`;
        }
    }
    
    return langRet;
};