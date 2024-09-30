import { MockUploadConfig } from "./MockUploadConfig";

export class PresentationUploadConfig implements MockUploadConfig {
  valid() {
    return {
      file: {
        originalname: "testfile.png",
        mimetype: "image/png",
        path: "/tests/testfile.png",
        filename: "testfile.png",
      },
      body: {
        name: "Test Name",
        description: "Test Description",
      },
    };
  }

  missingAllFields() {
    return {
      file: undefined,
      body: {
        name: "",
        description: "",
      },
    };
  }

  missingTextInputs() {
    return {
      file: this.valid().file,
      body: {
        name: "",
        description: "",
      },
    };
  }

  missingFile() {
    return {
      file: undefined,
      body: {
        name: "Test Name",
        description: "Test Description",
      },
    };
  }
}
