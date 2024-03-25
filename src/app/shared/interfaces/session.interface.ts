export interface session {
  id?: number;
  timestampStart: Date;
  timestampEnd?: Date;
  loginUser: string;
  idProject: number;
}
