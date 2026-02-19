import { getHostName } from "../utils/index.js";

describe("Host name", () => {
  it("should return the correct hostname", () => {
    expect(getHostName()).toBeTruthy();
  });
});
