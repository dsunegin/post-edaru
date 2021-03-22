/**
 * getFiles returns a list of all files in a directory path {dirPath}
 * that match a given file extension {fileExt} (optional).
 */
export declare const getFiles: (dirPath: string, fileExt?: string) => Promise<any>;
export declare const getRandomImage: (dirPath: string) => Promise<any>;
export declare const Capitalize: (tCap: string) => string;
export declare const sortRandom: (arr: Array<string | number>) => (string | number)[];
export declare const getRandomIntInclusive: (min: number, max: number) => number;
export declare const aliasSlug: (text: string) => string;
