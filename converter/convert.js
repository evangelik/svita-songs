const libxmljs = require("libxmljs");
const fs = require("fs");
const tmp = require("tmp");
const execSync = require("child_process").execSync;
const flatMap = require("array.prototype.flatmap");
const assert = require("assert").strict;
const AssertionError = require("assert").AssertionError;

const PARSE_ONLY_SONG = null; // For debugging

const SVITA_PRESENTATION_ODP_FILE = __dirname + "/../data/svita.odp";
const SVITA_NAMES_FILE = __dirname + "/../data/names";
const SVITA_AUTHORS_FILE = __dirname + "/../data/authors";
const SVITA_ILLUSTRATIONS_FILE = __dirname + "/../data/illustrations.json";
const TARGET_SVITA_JSON_FILE = __dirname + "/../svita.json";
const TARGET_SVITA_MARKDOWN_FILE = __dirname + "/../svita.md";

const XML_NAMESPACES = {
  draw: "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
  text: "urn:oasis:names:tc:opendocument:xmlns:text:1.0"
};

const SongSectionType = {
  UNKNOWN: "unknown",
  VERSE: "verse",
  REFRAIN: "refrain"
};

flatMap.shim(); // add flatMap() to Array.prototype

//
// main()
//

function main() {
  switch (process.argv[2]) {
    case "printJson":
      console.log(JSON.stringify(getSongs(), null, 2));
      break;

    case "saveJson":
      fs.writeFileSync(
        TARGET_SVITA_JSON_FILE,
        JSON.stringify(getSongs(), null, 2)
      );
      break;

    case "printMarkdown":
      console.log(getMarkdown());
      break;

    case "saveMarkdown":
      fs.writeFileSync(TARGET_SVITA_MARKDOWN_FILE, getMarkdown());
      break;

    case "printNames":
      console.log(JSON.stringify(getNames(), null, 2));
      break;

    default:
      console.log(
        "Unknown operation or no operation specified: " + process.argv[2]
      );
  }
}

//
// Building final songs from all available info.
//

function getSongs() {
  const names = getNames();
  const authors = getAuthors();
  const illustrations = getIllustrations();

  return getBaseSongsWithLyrics().map(baseSong => {
    const song = {
      id: baseSong.id,
      name: names[baseSong.id - 1],
      sections: baseSong.sections
    };

    if (authors[baseSong.id - 1]) {
      song.authors = authors[baseSong.id - 1];
    }

    if (illustrations[baseSong.id - 1]) {
      song.illustration = illustrations[baseSong.id - 1];
    }

    return song;
  });
}

//
// Loading names from the source file.
//

function getNames() {
  const names = fs
    .readFileSync(SVITA_NAMES_FILE)
    .toString()
    .split("\n")
    .map(name => name.trim())
    .filter(name => name);

  assert(
    (names.length = 489),
    "Unexpected number of song names: " + names.length
  );

  return names;
}

//
// Loading illustrations from the source file.
//

function getIllustrations() {
  const illustrations = [];

  JSON.parse(fs.readFileSync(SVITA_ILLUSTRATIONS_FILE).toString()).forEach(
    illustration =>
      illustration.song_ids.forEach(song_id => {
        assert(
          !illustrations[song_id - 1],
          "Song " + song_id + " already has an illustration!"
        );

        illustrations[song_id - 1] = {
          name: illustration.name,
          size: illustration.size
        };

        if (illustration.label) {
          illustrations[song_id - 1].label = illustration.label;
        }
      })
  );

  return illustrations;
}

//
// Loading authors from the source file.
//

function getAuthors() {
  const authors = [];

  fs
    .readFileSync(SVITA_AUTHORS_FILE)
    .toString()
    .split("\n")
    .map(author => author.trim())
    .filter(author => author)
    .map(parseAuthor)
    .forEach(author =>
      author.songs.forEach(song => {
        if (!authors[song - 1]) {
          authors[song - 1] = [];
        }

        authors[song - 1].push(author.name);
      })
    );

  return authors;
}

function parseAuthor(authorStr) {
  const [nameStr, songStr] = authorStr.split(":");
  const [lastName, firstName] = nameStr.split(",");
  const name = {};

  if (firstName && firstName.trim()) {
    name.firstName = firstName.trim();
  }

  name.lastName = lastName.trim();

  return {
    name: name,
    songs: songStr.split(",").map(s => Number(s.trim()))
  };
}

//
// Converting slides into base songs with lyrics.
//

function getBaseSongsWithLyrics() {
  return groupSlidesBySongId(getSlides()).map(slideGroup => ({
    id: slideGroup.songId,
    sections: convertParagraphsToSongSections(
      slideGroup.slides.flatMap(slide => slide.paragraphs)
    )
  }));
}

function convertParagraphsToSongSections(paragraphs) {
  const sections = [];
  let lastSection;
  let verseIndex = 1;

  paragraphs.forEach((paragraph, i) => {
    if (paragraph.prefix) {
      if (Number.isInteger(paragraph.prefix)) {
        lastSection = {
          type: SongSectionType.VERSE,
          verseIndex: verseIndex++
        };
      } else if (paragraph.prefix === "R") {
        lastSection = {
          type: SongSectionType.REFRAIN
        };
      } else {
        throw new AssertionError("Unknown prefix for paragraph: ", paragraph);
      }

      lastSection.paragraphs = [paragraph.text];

      sections.push(lastSection);
    } else {
      if (!lastSection) {
        lastSection = {
          type: SongSectionType.UNKNOWN,
          paragraphs: []
        };
        sections.push(lastSection);
      }

      lastSection.paragraphs.push(paragraph.text);
    }
  });

  return sections;
}

function groupSlidesBySongId(slides) {
  const groupedSlides = [];

  slides.forEach(slide => {
    assert(
      Number.isInteger(slide.songId),
      "The given song number is not a valid integer: " + slide.songId
    );

    if (!groupedSlides[slide.songId]) {
      groupedSlides[slide.songId] = {
        songId: slide.songId,
        slides: []
      };
    }

    groupedSlides[slide.songId].slides.push(slide);
  });

  return groupedSlides.filter(group => group);
}

//
// Converting the presentation into an array of JS representd slides.
//

function getSlides() {
  return getPresentationContentXml()
    .find("//draw:page", XML_NAMESPACES)
    .map(parseSlide)
    .filter(slide => isValidSongId(slide.songId));
}

function getPresentationContentXml() {
  const tmpDir = tmp.dirSync({unsafeCleanup: true});
  execSync("unzip " + SVITA_PRESENTATION_ODP_FILE + " -d " + tmpDir.name);

  const contentXml = libxmljs.parseXml(
    fs.readFileSync(tmpDir.name + "/content.xml").toString()
  );

  tmpDir.removeCallback(); // Clean-up

  return contentXml;
}

function parseSlide(slideXml) {
  if (PARSE_ONLY_SONG && parseSongId(slideXml) != PARSE_ONLY_SONG) {
    return {};
  }

  return {
    songId: parseSongId(slideXml),
    paragraphs: parseParagraphs(slideXml)
  };
}

function parseSongId(slideXml) {
  const songId = slideXml
    .find(".//text:span", XML_NAMESPACES)
    .filter(
      el =>
        el.attr("style-name").value() == "T6" ||
        el.attr("style-name").value() == "T17"
    )
    .map(el => el.text().trim())
    .join();

  return !isNaN(songId) ? Number(songId) : songId;
}

function isValidSongId(songId) {
  return songId && !isNaN(songId);
}

function parseParagraphs(slideXml) {
  let verseCount = 0;

  return slideXml
    .get(".//draw:text-box", XML_NAMESPACES)
    .find(".//text:p", XML_NAMESPACES)
    .map(paragraphXml => {
      // Okay, this actually doesn't really work. For example when a second
      // song slide is also using lists, this will number the verses starting
      // from one. But it doesn't matter as we re-index the verses later.
      // TODO(evangelik): Perhaps just state whether the index is "R:" or
      // numeric?
      const prefix = isListItem(paragraphXml)
        ? ++verseCount
        : extractParagraphPrefix(paragraphXml.text());

      if (prefix && !isNaN(prefix)) {
        verseCount = Number(prefix);
      }

      return {
        prefix: prefix,
        text: removeParagraphPrefix(
          prefix,
          paragraphXml
            .find(".//text:span", XML_NAMESPACES)
            .map(line => line.text().trim())
            .join("\n")
        )
          .trim()
          .replace(new RegExp("\n\n", "g"), "\n")
      };
    })
    .filter(paragraph => paragraph.text)
    .flatMap(splitParagraphByEmptyLine);
}

function isListItem(paragraphXml) {
  return paragraphXml.parent().name() == "list-item";
}

function extractParagraphPrefix(paragraphText) {
  if (paragraphText.startsWith("R")) {
    return "R";
  } else {
    const matchedNumber = paragraphText.match(/^\s*(\d)/);
    if (matchedNumber) {
      return Number(matchedNumber[1]);
    } else {
      return "";
    }
  }
}

function removeParagraphPrefix(prefix, paragraphText) {
  if (prefix) {
    // We remove one extra character (typically a dot or a collon).
    return paragraphText.replace(new RegExp("^\\s*" + prefix + "."), "");
  } else {
    return paragraphText;
  }
}

function splitParagraphByEmptyLine(paragraph) {
  const splitParagraphs = paragraph.text.split("\n\n").map(text => ({
    prefix: "",
    text: text.trim()
  }));

  splitParagraphs[0].prefix = paragraph.prefix;
  return splitParagraphs;
}

//
// Printing songs to Markdown.
//

function getMarkdown() {
  return (
    "# Svítá \n\n" +
    getSongs()
      .map(getSongMarkdown)
      .join("\n\n")
  );
}

function getSongMarkdown(song) {
  return (
    "## " +
    song.id +
    " " +
    song.name +
    "\n\n" +
    getAuthorsMarkdown(song) +
    song.sections.map(getSongSectionMarkdown).join("\n\n")
  );
}

function getAuthorsMarkdown(song) {
  if (!song.authors) {
    return "";
  }

  return (
    "*" +
    song.authors
      .map(
        author =>
          (author.firstName ? author.firstName + " " : "") + author.lastName
      )
      .join(", ") +
    "*\n\n"
  );
}

function getSongSectionMarkdown(section) {
  return (
    getSectionPrefixMarkdown(section) +
    getParagraphsMarkdown(section.paragraphs)
  );
}

function getSectionPrefixMarkdown(section) {
  switch (section.type) {
    case SongSectionType.VERSE:
      return "(" + section.verseIndex + ") ";

    case SongSectionType.REFRAIN:
      return "*Ref:* ";

    case SongSectionType.UNKNOWN:
      return "";

    default:
      throw new AssertionError(
        "Unknown song section type for section: " + section
      );
  }
}

function getParagraphsMarkdown(paragraphs) {
  return paragraphs
    .map(paragraph => paragraph.split("\n").join("<br />"))
    .join("\n\n");
}

main();
