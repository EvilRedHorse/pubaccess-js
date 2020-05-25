import axios from "axios";
import PubaccessClient, { getUrl, download, open, upload, uploadDirectory } from "./index";

jest.mock("axios");

const portalUrl = "https://scp.techandsupply.ca";
const skylink = "WhitePaperPDF-publink";

describe("PubaccessClient", () => {
  it("should contain all api methods", () => {
    const skynetClient = new PubaccessClient();

    expect(pubaccessClient).toHaveProperty("upload");
    expect(pubaccessClient).toHaveProperty("download");
    expect(pubaccessClient).toHaveProperty("open");
    expect(pubaccessClient).toHaveProperty("getUrl");
  });
});

describe("getUrl", () => {
  it("should return correctly formed url", () => {
    const url = getUrl(portalUrl, publink);

    expect(url).toEqual(`${portalUrl}/${publink}`);
  });

  it("should return correctly formed url with forced download", () => {
    const url = getUrl(portalUrl, publink, { download: true });

    expect(url).toEqual(`${portalUrl}/${publink}?attachment=true`);
  });
});

describe("download", () => {
  it("should call window.open with a download url", () => {
    const windowOpen = jest.spyOn(window, "open").mockImplementation();

    download(portalUrl, publink);

    expect(windowOpen).toHaveBeenCalledWith(`${portalUrl}/${publink}?attachment=true`, "_blank");
  });
});

describe("open", () => {
  it("should call window.open with a download url", () => {
    const windowOpen = jest.spyOn(window, "open").mockImplementation();

    open(portalUrl, publink);

    expect(windowOpen).toHaveBeenCalledWith(`${portalUrl}/${publink}`, "_blank");
  });
});

describe("upload", () => {
  const filename = "image.jpeg";
  const blob = new Blob([], { type: "image/jpeg" });
  const file = new File([blob], filename);

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { publink } });
  });

  it("should send post request with FormData", () => {
    upload(portalUrl, file);

    expect(axios.post).toHaveBeenCalledWith(`${portalUrl}/pubaccess/pubfile`, expect.any(FormData), undefined);
  });

  it("should send register onUploadProgress callback if defined", () => {
    upload(portalUrl, file, { onUploadProgress: jest.fn() });

    expect(axios.post).toHaveBeenCalledWith(`${portalUrl}/pubaccess/pubfile`, expect.any(FormData), {
      onUploadProgress: expect.any(Function),
    });
  });

  it("should return publink on success", async () => {
    const data = await upload(portalUrl, file);

    expect(data).toEqual({ publink });
  });
});

describe("uploadDirectory", () => {
  const blob = new Blob([], { type: "image/jpeg" });
  const filename = "i-am-root";
  const directory = {
    "i-am-not/file1.jpeg": new File([blob], "i-am-not/file1.jpeg"),
    "i-am-not/file2.jpeg": new File([blob], "i-am-not/file2.jpeg"),
    "i-am-not/me-neither/file3.jpeg": new File([blob], "i-am-not/me-neither/file3.jpeg"),
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { publink } });
  });

  it("should send post request with FormData", () => {
    uploadDirectory(portalUrl, directory, filename);

    expect(axios.post).toHaveBeenCalledWith(
      `${portalUrl}/pubaccess/pubfile?filename=${filename}`,
      expect.any(FormData),
      undefined
    );
  });

  it("should send register onUploadProgress callback if defined", () => {
    uploadDirectory(portalUrl, directory, filename, { onUploadProgress: jest.fn() });

    expect(axios.post).toHaveBeenCalledWith(`${portalUrl}/pubaccess/pubfile?filename=${filename}`, expect.any(FormData), {
      onUploadProgress: expect.any(Function),
    });
  });

  it("should return single publink on success", async () => {
    const data = await uploadDirectory(portalUrl, directory, filename);

    expect(data).toEqual({ publink });
  });
});
