const flatMap = require("array.prototype.flatmap");
const AssertionError = require("assert").AssertionError;

const SongSectionType = {
  UNKNOWN: "unknown",
  VERSE: "verse",
  REFRAIN: "refrain"
};

flatMap.shim(); // add flatMap() to Array.prototype

//
// Printing songs to Markdown.
//

function exportToMarkDown(songs) {
  return (
    "# Svítá \n\n" +
   songs
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
    song.sections.map(getSongSectionMarkdown).join("\n\n") +
    getIllustrationMarkdown(song)
  );
}

function getIllustrationMarkdown(song) {
  if (!song.illustration) {
    return "";
  }

  let width;

  switch (song.illustration.size) {
    case "small":
      width = " width=100";
      break;
    case "medium":
      width = " width=270";
      break;
    default:
      width = "";
  }

  const label = song.illustration.label
    ? "\n<i>" + song.illustration.label + "</i>"
    : "";

  return (
    '\n\n<p align="center">\n' +
    '<img src="illustrations/' +
    song.illustration.name +
    '.png"' +
    width +
    ">" +
    label +
    "\n</p>\n"
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

module.exports = exportToMarkDown;
