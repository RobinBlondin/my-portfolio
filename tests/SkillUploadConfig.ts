import { MockUploadConfig } from "./MockUploadConfig";

export class SkillUploadConfig implements MockUploadConfig {
  valid() {
    return {
      file: {
        originalname: "testfile.png",
        mimetype: "image/png",
        path: "/tests/testfile.png",
        filename: "testfile.png",
      },
      body: {
        name: "Test Name"
      },
    };
  }

  missingAllFields() {
    return {
      file: undefined,
      body: {
        name: ""
      },
    };
  }

  missingTextInputs() {
    return {
      file: this.valid().file,
      body: {
        name: ""
      },
    };
  }

  missingFile() {
    return {
      file: undefined,
      body: {
        name: "Test Name"
      },
    };
  }
}