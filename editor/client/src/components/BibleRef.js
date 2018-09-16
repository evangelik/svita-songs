import React from "react";
import makePureRender from "../util/makePureRender";
import {BIBLE_BOOKS} from '../data/bibleBooks';

const BibleRef = ({bibleRef, onChange}) => {

  const onBookChange =
      ({target: {value}}) => onChange(
          bibleRef.set("book", value).set("chapter", 1));

  const onChapterChange =
      ({target: {value}}) => onChange(
          bibleRef.set("chapter", value));

  const onVerseStartChange =
      ({target: {value}}) =>
          onChange(
              isValidVerse(value)
                  ? bibleRef.set("verseStart", Number(value))
                  : bibleRef.remove("verseStart"));

  const onVerseEndChange =
      ({target: {value}}) =>
          onChange(
              isValidVerse(value)
                  ? bibleRef.set("verseEnd", Number(value))
                  : bibleRef.remove("verseEnd"));

  return <div className="form-group row bible-ref-row">
    <div className="col-5">
      <select className="form-control"
              onChange={onBookChange}
              value={bibleRef.get("book")}>
        <optgroup label="Kniha">
          {Object.getOwnPropertyNames(BIBLE_BOOKS).map(book =>
              <option key={book} value={book}>
                {BIBLE_BOOKS[book].label}
              </option>)}
        </optgroup>
      </select>
    </div>

    <div className="col-3">
      <select className="form-control"
              onChange={onChapterChange}
              value={bibleRef.get("chapter")}>
        <optgroup label="Kapitola">
          {Array.from(
              Array(BIBLE_BOOKS[bibleRef.get("book")].chapterCount).keys())
              .map(i => i + 1).map(
                  chapter =>
                      <option key={chapter} value={chapter}>
                        {chapter}
                      </option>)}
          )}
        </optgroup>
      </select>
    </div>

    <div className="col-2">
      <input className="form-control"
             value={bibleRef.get("verseStart") || ""}
             onChange={onVerseStartChange}
             placeholder="Od"/>
    </div>

    <div className="col-2">
      <input className="form-control"
             value={bibleRef.get("verseEnd") || ""}
             onChange={onVerseEndChange}
             placeholder="Do"/>
    </div>
  </div>;
};

function isValidVerse(value) {
  return !isNaN(value) && Number(value) > 0;
}

export default makePureRender(BibleRef);
