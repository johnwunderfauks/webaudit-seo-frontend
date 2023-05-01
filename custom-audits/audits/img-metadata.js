const { Audit } = require("lighthouse");
const ExifReader = require("exifreader");
const fsPromises = require("fs").promises;

const exifErrors = ExifReader.errors;

class ImgMetaData extends Audit {
  static get meta() {
    return {
      id: "img-metadata",
      title: "This webpage is not using images with large metadata.",
      failureTitle: "This webpage is using images with large metadata.",
      description: "Image metaData.",
      requiredArtifacts: ["ImgElements"],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   */
  static audit(artifacts, context) {
    const checkTags = [
      "Copyright",
      "Make",
      "Model",
      "ISOSpeedRatings",
      "Flash",
      "FocalLengthIn35mmFilm",
      "Contrast",
      "LightSource",
      "ExposureProgram",
      "Saturation",
      "Sharpness",
      "WhiteBalance",
    ];

    const checkxmpTags = [
      "subject",
      "Rating",
      "LensManufacturer",
      "LensModel",
      "FlashManufacturer",
      "FlashModel",
      "CameraSerialNumber",
    ];

    let foundUncessaryMetaData = false;

    async function myPromise() {
      const elementSummaries = artifacts.ImgElements;
      let imgLength = elementSummaries.length;
      return new Promise(async (resolve, reject) => {
        for (let i = 0; i < imgLength; i++) {
          try {
            let img = elementSummaries[i].src;
            const tags = await ExifReader.load(img, {
              expanded: true,
              includeUnknown: true,
            });
            if (tags?.exif) {
              checkTags.map((checkTag) => {
                if (tags.exif[checkTag]) {
                  if (Object.keys(tags.exif[checkTag]).length !== 0) {
                    foundUncessaryMetaData = true;
                  }
                }
              });
              if (tags?.xmp) {
                checkxmpTags.map((checkTag) => {
                  if (tags?.xmp[checkTag]) {
                    if (Object.keys(tags?.xmp[checkTag]).length !== 0) {
                      foundUncessaryMetaData = true;
                    }
                  }
                });
              }
            }
          } catch (error) {
            if (error instanceof exifErrors.MetadataMissingError) {
              console.log("No Exif data found");
            }
          }
        }
        resolve(foundUncessaryMetaData);
      });
    }

    const fetch = async () => {
      let data = await myPromise();

      if (data) {
        return {
          score: 0,
        };
      }
      return {
        score: 1,
      };
    };

    return fetch();
  }
}

module.exports = ImgMetaData;
