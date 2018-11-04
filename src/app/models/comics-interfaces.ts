declare module 'comics-interfaces' {

  export interface Comic {
    _id: string;
    publisher: string;
    serie_title: string;
    serie_number: number;
    title: string;
    pages: number;
    release_date: Date;
    in_collection: boolean;
    read: boolean;
    read_date: Date;
  }

  export interface Serie {
    _id: string;
    total: number;
    read: number;
  }

}
