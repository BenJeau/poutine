import {
    BlobReader,
    BlobWriter,
    ZipWriter,
  } from "@zip.js/zip.js";

export const buildDocument = async (response: Response) => {
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, "text/html");
}

export const zipFiles = async (files: {
    name: string;
    blob: Blob;
}[]) => {
    const writer = new BlobWriter();
    const zip = new ZipWriter(writer);
    await Promise.all(files.map(async (file) => {
        const reader = new BlobReader(file.blob);
        await zip.add(file.name, reader);
    }));
    await zip.close();
    return writer.getData();
}

export const downloadZip = async (zip: Blob, name: string) => {
    const url = URL.createObjectURL(zip);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
}