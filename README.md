# Songbook Svítá in a machine readable format

Check out the [svita.json](svita.json) file for a JSON representation of the
Svítá song book.

Check out the [svita.md](svita.md) Markdown file to see what can be easily
generated from the JSON file.

**Any errors in the JSON file are most likely caused by the irregularities in
the original source which is this [PowerPoint presentation](https://www.evangnet.cz/materialy/liturgie/683-svita_texty_pro_dataprojektor)**
(not exactly the most reliable source).

There is a [converter](converter/convert.js) script that extracts the songs
from a [copy](data/svita.odp) of the aforementioned presentation in the ODP
format (it's XML; it can be traversed). If you want to run the converter, first
please install node.js and download all required dependencies with
`npm install`.  Then you can try out one of the following commands:

```
npm run printJson
npm run saveJson
npm run printMarkdown
npm run saveMarkdown
```
