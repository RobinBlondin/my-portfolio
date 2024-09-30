export interface MockUploadConfig {
    valid(): any;
    missingAllFields(): any;
    missingTextInputs(): any;
    missingFile(): any;
}