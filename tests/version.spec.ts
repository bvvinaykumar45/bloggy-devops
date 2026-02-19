import { getVersion } from "../utils/index.js";

describe("Version", () => {
  it("should return the correct application version", () => {
    expect(getVersion()).toBeTruthy();
  });
});
