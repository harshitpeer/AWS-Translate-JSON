const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");
const fs = require('fs');
require('dotenv').config();
const client = new TranslateClient({
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET
    }, region: process.env.AWS_REGION
});
const run = async (input, output) => {
    try {
        let translated = {};
        let en = JSON.parse(fs.readFileSync(`languages/${input}.json`));
        for (const [key, value] of Object.entries(en)) {
            translated[key] = await translate(value, input, output);
        }
        fs.appendFile(`languages/${output}.json`, JSON.stringify(translated), function (err) {
            if (err) throw err;
            console.log('Translation Completed');
        });
    } catch (err) {
        console.log("Error", err);
    }
};
const translate = async (text, input, output) => {
    const command = new TranslateTextCommand({
        "SourceLanguageCode": input,
        "TargetLanguageCode": output,
        "TerminologyNames": [],
        "Text": text
    });
    const response = await client.send(command);
    return response.TranslatedText;
}
/**
 * `run` function accepts 2 parameters
 * 
 * @param
 * input: the file name located in languages directory without extensions
 * output:  the file name which will be created or replaced in the languages directory without extensions
 */
run('en', 'hi');