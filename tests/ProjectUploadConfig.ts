import { MockUploadConfig } from "./MockUploadConfig";

export class ProjectUploadConfig implements MockUploadConfig {
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
          link: "http://testlink.com",
        },
      };
    }
  
    missingAllFields() {
      return {
        file: undefined,
        body: {
          name: "",
          link: "http://testlink.com",
        },
      };
    }
  
    missingTextInputs() {
      return {
        file: this.valid().file,
        body: {
          name: "",
          link: "",
        },
      };
    }
  
    missingFile() {
      return {
        file: undefined,
        body: {
          name: "Test Name",
          link: "http://testlink.com",
        },
      };
    }
  }